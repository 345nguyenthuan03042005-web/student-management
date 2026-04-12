import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { EnrollmentService, ScoreService, StudentService } from '../services/studentService';
import { useLanguage } from '../hooks';
import './StudentPage.css';

const copyByLanguage = {
  vi: {
    title: 'Chi tiết điểm số',
    summary: 'Tổng quan đầu điểm',
    scoreType: 'Loại điểm',
    score: 'Điểm',
    maxScore: 'Điểm tối đa',
    weight: 'Trọng số',
    grade: 'Xếp loại',
    examDate: 'Ngày kiểm tra',
    remarks: 'Ghi chú',
    enrollment: 'Đăng ký học',
    enrollmentId: 'Mã đăng ký',
    student: 'Sinh viên',
    studentId: 'Mã sinh viên',
    classSubjectId: 'Mã lớp-môn'
  },
  en: {
    title: 'Score Details',
    summary: 'Score overview',
    scoreType: 'Score type',
    score: 'Score',
    maxScore: 'Max score',
    weight: 'Weight',
    grade: 'Grade',
    examDate: 'Exam date',
    remarks: 'Remarks',
    enrollment: 'Enrollment',
    enrollmentId: 'Enrollment ID',
    student: 'Student',
    studentId: 'Student ID',
    classSubjectId: 'Class-subject ID'
  }
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

export const ScoreDetailPage = () => {
  const { scoreId } = useParams();
  const { language, t } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const [score, setScore] = React.useState(null);
  const [enrollment, setEnrollment] = React.useState(null);
  const [studentDetail, setStudentDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchScoreDetail = async () => {
      setLoading(true);
      try {
        const scoreResponse = await ScoreService.getScore(scoreId);
        const scoreData = scoreResponse.data;
        setScore(scoreData);

        const enrollmentResponse = await EnrollmentService.getEnrollment(scoreData.enrollment_id);
        setEnrollment(enrollmentResponse.data);

        const studentResponse = await StudentService.getStudent(enrollmentResponse.data.student_id);
        setStudentDetail(studentResponse.data);
      } catch (error) {
        console.error('Failed to fetch score details:', error);
        setScore(null);
        setEnrollment(null);
        setStudentDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreDetail();
  }, [scoreId]);

  return (
    <div className="layout">
      <Navbar />
      <div className="main-container">
        <Sidebar activeMenu="scores" />
        <main className="main-content">
          <section className="content-hero">
            <div>
              <h1>{copy.title}</h1>
              <p>{score ? `#${score.id}` : t.common.loading}</p>
            </div>
            <div className="content-hero-actions">
              <Link to="/scores" className="btn-primary btn-secondary-tone">
                {language === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
              </Link>
            </div>
          </section>

          {loading ? (
            <div className="form-section">
              <p className="loading">{t.common.loading}</p>
            </div>
          ) : !score ? (
            <div className="form-section">
              <p className="no-data">{language === 'vi' ? 'Không tìm thấy đầu điểm' : 'Score not found'}</p>
            </div>
          ) : (
            <>
              <section className="detail-grid">
                <article className="detail-card">
                  <span className="detail-card-label">{copy.summary}</span>
                  <strong>{score.score}</strong>
                  <p>{copy.scoreType}: {score.score_type}</p>
                </article>
                <article className="detail-card">
                  <span className="detail-card-label">{copy.maxScore}</span>
                  <strong>{score.max_score}</strong>
                  <p>{copy.weight}: {score.weight}</p>
                </article>
                <article className="detail-card">
                  <span className="detail-card-label">{copy.grade}</span>
                  <strong>{score.grade || '-'}</strong>
                  <p>{copy.examDate}: {formatDate(score.exam_date)}</p>
                </article>
                <article className="detail-card">
                  <span className="detail-card-label">{copy.enrollment}</span>
                  <strong>#{score.enrollment_id}</strong>
                  <p>{copy.classSubjectId}: {enrollment?.class_subject_id || '-'}</p>
                </article>
              </section>

              <section className="form-section">
                <div className="section-heading">
                  <h2>{copy.enrollment}</h2>
                </div>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <span>{copy.enrollmentId}</span>
                    <strong>{enrollment ? `#${enrollment.id}` : '-'}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.student}</span>
                    <strong>
                      {studentDetail?.student ? (
                        <Link to={`/students/${studentDetail.student.id}`} className="table-inline-link">
                          {studentDetail.student.first_name} {studentDetail.student.last_name}
                        </Link>
                      ) : '-'}
                    </strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.studentId}</span>
                    <strong>{enrollment?.student_id || '-'}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.classSubjectId}</span>
                    <strong>{enrollment?.class_subject_id || '-'}</strong>
                  </div>
                  <div className="detail-info-item detail-info-item-wide">
                    <span>{copy.remarks}</span>
                    <strong>{score.remarks || '-'}</strong>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScoreDetailPage;
