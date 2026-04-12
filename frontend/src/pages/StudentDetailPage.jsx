import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { StudentService } from '../services/studentService';
import { useLanguage } from '../hooks';
import './StudentPage.css';

const copyByLanguage = {
  vi: {
    title: 'Chi tiết sinh viên',
    summary: 'Tổng quan hồ sơ',
    personalInfo: 'Thông tin cá nhân',
    enrollments: 'Đăng ký học',
    scores: 'Điểm số',
    classInfo: 'Lớp hiện tại',
    enrollmentDate: 'Ngày nhập học',
    averageScore: 'Điểm trung bình',
    studentCode: 'Mã sinh viên',
    fullName: 'Họ tên',
    email: 'Email',
    phone: 'Số điện thoại',
    gender: 'Giới tính',
    dateOfBirth: 'Ngày sinh',
    address: 'Địa chỉ',
    guardianName: 'Tên người giám hộ',
    guardianPhone: 'Số điện thoại người giám hộ',
    status: 'Trạng thái',
    enrollmentId: 'Mã đăng ký',
    classSubjectId: 'Mã lớp-môn',
    scoreType: 'Loại điểm',
    score: 'Điểm',
    examDate: 'Ngày kiểm tra',
    emptyEnrollments: 'Chưa có đăng ký học',
    emptyScores: 'Chưa có điểm số'
  },
  en: {
    title: 'Student Details',
    summary: 'Profile summary',
    personalInfo: 'Personal information',
    enrollments: 'Enrollments',
    scores: 'Scores',
    classInfo: 'Current class',
    enrollmentDate: 'Enrollment date',
    averageScore: 'Average score',
    studentCode: 'Student code',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    gender: 'Gender',
    dateOfBirth: 'Date of birth',
    address: 'Address',
    guardianName: 'Guardian name',
    guardianPhone: 'Guardian phone',
    status: 'Status',
    enrollmentId: 'Enrollment ID',
    classSubjectId: 'Class-subject ID',
    scoreType: 'Score type',
    score: 'Score',
    examDate: 'Exam date',
    emptyEnrollments: 'No enrollments yet',
    emptyScores: 'No scores yet'
  }
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

export const StudentDetailPage = () => {
  const { studentId } = useParams();
  const { language, t } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await StudentService.getStudent(studentId);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch student details:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const student = data?.student;
  const currentClass = data?.class;
  const enrollments = data?.enrollments || [];
  const scores = data?.scores || [];

  return (
    <div className="layout">
      <Navbar />
      <div className="main-container">
        <Sidebar activeMenu="students" />
        <main className="main-content">
          <section className="content-hero">
            <div>
              <h1>{copy.title}</h1>
              <p>{student ? `${student.first_name} ${student.last_name}` : t.common.loading}</p>
            </div>
            <div className="content-hero-actions">
              <Link to="/students" className="btn-primary btn-secondary-tone">
                {language === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
              </Link>
            </div>
          </section>

          {loading ? (
            <div className="form-section">
              <p className="loading">{t.common.loading}</p>
            </div>
          ) : !student ? (
            <div className="form-section">
              <p className="no-data">{language === 'vi' ? 'Không tìm thấy sinh viên' : 'Student not found'}</p>
            </div>
          ) : (
            <>
              <section className="detail-grid">
                <article className="detail-card">
                  <span className="detail-card-label">{copy.summary}</span>
                  <strong>{student.student_code}</strong>
                  <p>{copy.studentCode}</p>
                </article>
                <article className="detail-card">
                  <span className="detail-card-label">{copy.classInfo}</span>
                  <strong>{currentClass?.name || '-'}</strong>
                  <p>{currentClass?.academic_year || '-'}</p>
                </article>
                <article className="detail-card">
                  <span className="detail-card-label">{copy.enrollmentDate}</span>
                  <strong>{formatDate(student.enrollment_date)}</strong>
                  <p>{copy.status}: {student.status}</p>
                </article>
                <article className="detail-card">
                  <span className="detail-card-label">{copy.averageScore}</span>
                  <strong>{data?.average_score ?? '-'}</strong>
                  <p>{scores.length} {language === 'vi' ? 'đầu điểm' : 'records'}</p>
                </article>
              </section>

              <section className="form-section">
                <div className="section-heading">
                  <h2>{copy.personalInfo}</h2>
                </div>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <span>{copy.fullName}</span>
                    <strong>{student.first_name} {student.last_name}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.email}</span>
                    <strong>{student.email}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.phone}</span>
                    <strong>{student.phone || '-'}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.gender}</span>
                    <strong>{student.gender || '-'}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.dateOfBirth}</span>
                    <strong>{formatDate(student.date_of_birth)}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.address}</span>
                    <strong>{student.address || '-'}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.guardianName}</span>
                    <strong>{student.guardian_name || '-'}</strong>
                  </div>
                  <div className="detail-info-item">
                    <span>{copy.guardianPhone}</span>
                    <strong>{student.guardian_phone || '-'}</strong>
                  </div>
                </div>
              </section>

              <section className="students-table-section detail-section">
                <div className="section-heading detail-section-heading">
                  <h2>{copy.enrollments}</h2>
                </div>
                {enrollments.length === 0 ? (
                  <p className="no-data detail-empty">{copy.emptyEnrollments}</p>
                ) : (
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>{copy.enrollmentId}</th>
                        <th>{copy.classSubjectId}</th>
                        <th>{copy.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((item) => (
                        <tr key={item.id}>
                          <td>#{item.id}</td>
                          <td>#{item.class_subject_id}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              <section className="students-table-section detail-section">
                <div className="section-heading detail-section-heading">
                  <h2>{copy.scores}</h2>
                </div>
                {scores.length === 0 ? (
                  <p className="no-data detail-empty">{copy.emptyScores}</p>
                ) : (
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{copy.scoreType}</th>
                        <th>{copy.score}</th>
                        <th>{copy.examDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <Link to={`/scores/${item.id}`} className="table-inline-link">
                              #{item.id}
                            </Link>
                          </td>
                          <td>{item.score_type}</td>
                          <td>{item.score}</td>
                          <td>{formatDate(item.exam_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDetailPage;
