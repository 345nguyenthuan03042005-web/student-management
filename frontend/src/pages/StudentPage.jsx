import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StudentForm from '../components/StudentForm';
import { StudentService } from '../services/studentService';
import { useAuth, useLanguage } from '../hooks';
import { exportToCsv } from '../utils/csv';
import './StudentPage.css';

const IMPORT_HEADER_ALIASES = {
  student_code: 'student_code',
  masinhvien: 'student_code',
  ma_sinh_vien: 'student_code',
  first_name: 'first_name',
  ten: 'first_name',
  last_name: 'last_name',
  ho: 'last_name',
  email: 'email',
  phone: 'phone',
  sodienthoai: 'phone',
  so_dien_thoai: 'phone',
  date_of_birth: 'date_of_birth',
  ngaysinh: 'date_of_birth',
  ngay_sinh: 'date_of_birth',
  gender: 'gender',
  gioitinh: 'gender',
  gioi_tinh: 'gender',
  address: 'address',
  diachi: 'address',
  dia_chi: 'address',
  class_id: 'class_id',
  malop: 'class_id',
  ma_lop: 'class_id',
  lop: 'class_id',
  enrollment_date: 'enrollment_date',
  ngaynhaphoc: 'enrollment_date',
  ngay_nhap_hoc: 'enrollment_date',
  status: 'status',
  trangthai: 'status',
  trang_thai: 'status'
};

export const StudentPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const pageCopy = t.studentsPage;
  const commonCopy = t.common;
  const detailsLabel = language === 'vi' ? 'Chi tiết' : 'Details';
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingStudent, setEditingStudent] = React.useState(null);
  const [importText, setImportText] = React.useState('');
  const [importResult, setImportResult] = React.useState(null);
  const [selectedImportFile, setSelectedImportFile] = React.useState(null);

  const canManage = user?.role === 'admin' || user?.role === 'teacher';

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await StudentService.getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const resetPanels = () => {
    setShowForm(false);
    setShowImport(false);
    setEditingStudent(null);
    setImportResult(null);
  };

  const handleSaveStudent = async (formData) => {
    setLoading(true);
    try {
      if (editingStudent) {
        await StudentService.updateStudent(editingStudent.id, formData);
      } else {
        await StudentService.createStudent(formData);
      }
      resetPanels();
      await fetchStudents();
    } catch (error) {
      console.error('Failed to save student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    if (!canManage) {
      window.alert(commonCopy.roleRestricted);
      return;
    }

    setEditingStudent(student);
    setShowForm(true);
    setShowImport(false);
  };

  const handleDeleteStudent = async (id) => {
    if (!canManage) {
      window.alert(commonCopy.roleRestricted);
      return;
    }

    if (window.confirm(pageCopy.confirmDelete)) {
      try {
        await StudentService.deleteStudent(id);
        await fetchStudents();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  const normalizeHeader = (value) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

  const normalizeGender = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (['nam', 'male', 'm'].includes(normalized)) return 'Male';
    if (['nu', 'nữ', 'female', 'f'].includes(normalized)) return 'Female';
    if (['khac', 'khác', 'other'].includes(normalized)) return 'Other';
    return 'Male';
  };

  const normalizeStatus = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (['danghoc', 'đang học', 'active'].includes(normalized)) return 'Active';
    if (['tamdung', 'tạm dừng', 'inactive'].includes(normalized)) return 'Inactive';
    if (['datotnghiep', 'đã tốt nghiệp', 'graduated'].includes(normalized)) return 'Graduated';
    if (['dinhchi', 'đình chỉ', 'suspended'].includes(normalized)) return 'Suspended';
    return 'Active';
  };

  const parseSpreadsheetText = (rawText) => {
    const rows = rawText
      .split(/\r?\n/)
      .map((row) => row.replace(/^\uFEFF/, '').trim())
      .filter(Boolean);

    if (rows.length === 0) return [];

    const delimiter = rows[0].includes('\t') ? '\t' : rows[0].includes(';') ? ';' : ',';
    const parsedRows = rows.map((row) => row.split(delimiter).map((cell) => cell.trim()));
    const firstRow = parsedRows[0];
    const mappedHeaders = firstRow.map((header) => IMPORT_HEADER_ALIASES[normalizeHeader(header)] || null);
    const hasHeader = mappedHeaders.some(Boolean);
    const dataRows = hasHeader ? parsedRows.slice(1) : parsedRows;
    const fallbackHeaders = [
      'student_code',
      'first_name',
      'last_name',
      'email',
      'phone',
      'date_of_birth',
      'gender',
      'address',
      'class_id',
      'enrollment_date',
      'status'
    ];
    const headers = hasHeader ? mappedHeaders : fallbackHeaders;

    return dataRows
      .filter((row) => row.some((cell) => cell !== ''))
      .map((row) => {
        const record = {};
        headers.forEach((field, index) => {
          if (!field) return;
          record[field] = row[index] ?? '';
        });

        return {
          student_code: record.student_code || '',
          first_name: record.first_name || '',
          last_name: record.last_name || '',
          email: record.email || '',
          phone: record.phone || null,
          date_of_birth: record.date_of_birth || null,
          gender: normalizeGender(record.gender),
          address: record.address || null,
          class_id: Number(record.class_id),
          enrollment_date: record.enrollment_date || new Date().toISOString().split('T')[0],
          status: normalizeStatus(record.status)
        };
      })
      .filter(
        (row) =>
          row.student_code &&
          row.first_name &&
          row.last_name &&
          row.email &&
          Number.isFinite(row.class_id)
      );
  };

  const handleImportStudents = async () => {
    if (!canManage) {
      window.alert(commonCopy.roleRestricted);
      return;
    }
    if (!importText.trim()) {
      window.alert('Vui lòng dán dữ liệu Excel trước khi import.');
      return;
    }

    const parsedStudents = parseSpreadsheetText(importText);
    if (parsedStudents.length === 0) {
      window.alert('Không đọc được dữ liệu. Hãy kiểm tra lại cột hoặc định dạng.');
      return;
    }

    setLoading(true);
    setImportResult(null);

    try {
      const response = await StudentService.importStudentsBulk(parsedStudents);
      setImportResult(response.data);
      setImportText('');
      setSelectedImportFile(null);
      await fetchStudents();
    } catch (error) {
      console.error('Failed to import students:', error);
      setImportResult({
        created_count: 0,
        error_count: 1,
        errors: [{ row: '-', error: error.response?.data?.detail || 'Import failed' }]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImportFile(file.name);

    try {
      const text = await file.text();
      setImportText(text);
      setImportResult(null);
    } catch (error) {
      console.error('Failed to read import file:', error);
      window.alert('Không đọc được file. Hãy thử lưu lại từ Excel dưới dạng CSV UTF-8 rồi tải lên lại.');
    }
  };

  const handleExportCsv = () => {
    exportToCsv(
      'students.csv',
      filteredStudents.map((student) => ({
        student_code: student.student_code,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone || '',
        class_id: student.class_id,
        status: student.status
      }))
    );
  };

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name} ${student.email} ${student.student_code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const renderStatusLabel = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === 'active') return pageCopy.active;
    if (normalized === 'inactive') return pageCopy.inactive;
    if (normalized === 'graduated') return pageCopy.graduated;
    if (normalized === 'suspended') return pageCopy.suspended;
    return status;
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="main-container">
        <Sidebar activeMenu="students" />
        <main className="main-content">
          <section className="content-hero">
            <div>
              <h1>{pageCopy.title}</h1>
              <p>Tra cứu, cập nhật hồ sơ và nhập dữ liệu sinh viên theo lô từ một màn hình thống nhất.</p>
            </div>
            <div className="content-hero-actions">
              <button type="button" className="btn-primary btn-secondary-tone" onClick={handleExportCsv}>
                {commonCopy.exportCsv}
              </button>
              {canManage && (
                <>
                  <button
                    type="button"
                    className="btn-primary btn-secondary-tone"
                    onClick={() => {
                      setShowImport((prev) => !prev);
                      setShowForm(false);
                      setEditingStudent(null);
                    }}
                  >
                    {showImport ? `${commonCopy.close}` : pageCopy.importExcel}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setShowForm((prev) => !prev);
                      setShowImport(false);
                      setEditingStudent(null);
                    }}
                  >
                    {showForm ? commonCopy.close : pageCopy.addStudent}
                  </button>
                </>
              )}
            </div>
          </section>

          {showForm && (
            <div className="form-section">
              <div className="section-heading">
                <h2>{editingStudent ? pageCopy.editStudent : pageCopy.addStudent}</h2>
              </div>
              <StudentForm onSubmit={handleSaveStudent} initialData={editingStudent} isLoading={loading} />
            </div>
          )}

          {showImport && canManage && (
            <div className="form-section import-section">
              <div className="section-heading">
                <h2>{pageCopy.importExcel}</h2>
                <p>{pageCopy.importDescription}</p>
              </div>
              <div className="import-helper">
                <strong>Thứ tự cột hỗ trợ:</strong> mã_sinh_viên | tên | họ | email | số_điện_thoại | ngày_sinh |
                giới_tính | địa_chỉ | mã_lớp | ngày_nhập_học | trạng_thái
              </div>
              <div className="import-upload">
                <label className="import-upload-label" htmlFor="student-import-file">
                  Chọn file
                </label>
                <input
                  id="student-import-file"
                  type="file"
                  accept=".csv,.tsv,.txt"
                  className="import-file-input"
                  onChange={handleImportFileChange}
                  disabled={loading}
                />
                <div className="import-upload-copy">
                  <strong>Hoặc tải file từ Excel</strong>
                  <span>Hỗ trợ file .csv, .tsv hoặc .txt xuất từ Excel.</span>
                  {selectedImportFile && <span className="import-selected-file">Đã chọn file: {selectedImportFile}</span>}
                </div>
              </div>
              <textarea
                className="import-textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={pageCopy.importPlaceholder}
                disabled={loading}
              />
              <div className="form-actions import-actions">
                <button type="button" className="btn-submit" onClick={handleImportStudents} disabled={loading}>
                  {loading ? commonCopy.loading : 'Import dữ liệu'}
                </button>
              </div>
              {importResult && (
                <div className="import-result">
                  <p>
                    <strong>Đã tạo:</strong> {importResult.created_count || 0}
                  </p>
                  <p>
                    <strong>Lỗi:</strong> {importResult.error_count || 0}
                  </p>
                  {Array.isArray(importResult.errors) && importResult.errors.length > 0 && (
                    <div className="import-errors">
                      {importResult.errors.map((item, index) => (
                        <div key={`${item.row}-${index}`} className="import-error-item">
                          Dòng {item.row}: {item.student_code ? `${item.student_code} - ` : ''}
                          {item.error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="toolbar-card">
            <input
              type="text"
              placeholder={pageCopy.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="students-table-section">
            {loading && !showForm && !showImport ? (
              <p className="loading">{pageCopy.loadingStudents}</p>
            ) : filteredStudents.length === 0 ? (
              <p className="no-data">{pageCopy.noStudentsFound}</p>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>{pageCopy.studentId}</th>
                    <th>{pageCopy.name}</th>
                    <th>{pageCopy.email}</th>
                    <th>{pageCopy.phone}</th>
                    <th>{pageCopy.class}</th>
                    <th>{pageCopy.status}</th>
                    <th>{pageCopy.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.student_code}</td>
                      <td>{student.first_name} {student.last_name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || '-'}</td>
                      <td>{student.class_id}</td>
                      <td>
                        <span className={`status ${student.status.toLowerCase()}`}>{renderStatusLabel(student.status)}</span>
                      </td>
                      <td className="actions">
                        <Link to={`/students/${student.id}`} className="btn-small btn-info">
                          {detailsLabel}
                        </Link>
                        {canManage ? (
                          <>
                            <button type="button" onClick={() => handleEditStudent(student)} className="btn-small btn-info">
                              {commonCopy.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="btn-small btn-danger"
                            >
                              {commonCopy.delete}
                            </button>
                          </>
                        ) : (
                          <span className="muted-text">Chỉ xem</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentPage;
