import apiClient from './api';

// ================== STUDENT ==================
export class StudentService {
  static getStudents(params = {}) {
    return apiClient.get('/api/v1/students', { params });
  }

  static getStudent(studentId) {
    return apiClient.get(`/api/v1/students/${studentId}`);
  }

  static createStudent(studentData) {
    return apiClient.post('/api/v1/students', studentData);
  }

  static importStudentsBulk(studentsData) {
    return apiClient.post('/api/v1/students/import', studentsData);
  }

  static updateStudent(studentId, studentData) {
    return apiClient.put(`/api/v1/students/${studentId}`, studentData);
  }

  static deleteStudent(studentId) {
    return apiClient.delete(`/api/v1/students/${studentId}`);
  }

  static deleteStudentsBulk(studentIds) {
    return apiClient.post('/api/v1/students/bulk-delete', {
      student_ids: studentIds
    });
  }

  static getStudentsByClass(classId, params = {}) {
    return apiClient.get('/api/v1/students', {
      params: { ...params, class_id: classId }
    });
  }
}

// ================== CLASS ==================
export class ClassService {
  static getClasses(params = {}) {
    return apiClient.get('/api/v1/classes', { params });
  }

  static getClass(classId) {
    return apiClient.get(`/api/v1/classes/${classId}`);
  }

  static createClass(classData) {
    return apiClient.post('/api/v1/classes', classData);
  }

  static updateClass(classId, classData) {
    return apiClient.put(`/api/v1/classes/${classId}`, classData);
  }

  static deleteClass(classId) {
    return apiClient.delete(`/api/v1/classes/${classId}`);
  }
}

// ================== SUBJECT ==================
export class SubjectService {
  static getSubjects(params = {}) {
    return apiClient.get('/api/v1/subjects', { params });
  }

  static getSubject(subjectId) {
    return apiClient.get(`/api/v1/subjects/${subjectId}`);
  }

  static createSubject(subjectData) {
    return apiClient.post('/api/v1/subjects', subjectData);
  }

  static updateSubject(subjectId, subjectData) {
    return apiClient.put(`/api/v1/subjects/${subjectId}`, subjectData);
  }

  static deleteSubject(subjectId) {
    return apiClient.delete(`/api/v1/subjects/${subjectId}`);
  }
}

// ================== AUTH ==================
export class AuthService {
  static login(credentials) {
    return apiClient.post('/api/v1/auth/login', credentials);
  }

  static logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}

// ================== EXTRA (nếu dùng sau này) ==================
export class EnrollmentService {
  static getEnrollments(params = {}) {
    return apiClient.get('/api/v1/enrollments', { params });
  }
}

export class RoomService {
  static getRooms(params = {}) {
    return apiClient.get('/api/v1/rooms', { params });
  }
}

export class ScoreService {
  static getScores(params = {}) {
    return apiClient.get('/api/v1/scores', { params });
  }
}
