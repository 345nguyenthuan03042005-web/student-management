"""
SQLAlchemy ORM models aligned with the current database schema.
"""

from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    DECIMAL,
    Enum,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.orm import foreign, relationship

from ..db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("admin", "teacher", "student"), nullable=False, default="student")
    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)
    student_profile = relationship("Student", back_populates="user", uselist=False)


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True)
    code = Column(String(100), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    module_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True)
    role = Column(Enum("admin", "teacher", "student"), nullable=False)
    permission_id = Column(Integer, ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    permission = relationship("Permission")

    __table_args__ = (
        UniqueConstraint("role", "permission_id", name="unique_role_permission"),
    )


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True)
    teacher_code = Column(String(50), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    qualification = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    hire_date = Column(Date, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="teacher_profile")
    homeroom_classes = relationship("Class", back_populates="homeroom_teacher")
    teaching_assignments = relationship("SubjectTeacher", back_populates="teacher", cascade="all, delete-orphan")
    schedules = relationship(
        "ClassSchedule",
        back_populates="teacher",
        primaryjoin=lambda: Teacher.id == foreign(ClassSchedule.teacher_id),
        foreign_keys=lambda: [ClassSchedule.teacher_id],
    )


class AcademicTerm(Base):
    __tablename__ = "academic_terms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    academic_year = Column(String(20), nullable=False)
    semester_no = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_current = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class_subjects = relationship("ClassSubject", back_populates="academic_term")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String(50), unique=True, nullable=False)
    building = Column(String(100), nullable=True)
    floor_no = Column(Integer, nullable=True)
    capacity = Column(Integer, nullable=True)
    room_type = Column(
        Enum("classroom", "lab", "office", "hall"),
        nullable=False,
        default="classroom",
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    schedules = relationship("ClassSchedule", back_populates="room")


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    grade_level = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    academic_year = Column(String(20), nullable=True)
    homeroom_teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="SET NULL"), nullable=True)
    capacity = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    homeroom_teacher = relationship("Teacher", back_populates="homeroom_classes")
    students = relationship("Student", back_populates="class_info")
    class_subjects = relationship("ClassSubject", back_populates="class_info", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    credits = Column(Integer, nullable=False, default=3)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class_subjects = relationship("ClassSubject", back_populates="subject", cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True)
    student_code = Column(String(50), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(Enum("Male", "Female", "Other"), nullable=True)
    address = Column(Text, nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="RESTRICT"), nullable=False, index=True)
    enrollment_date = Column(Date, nullable=False)
    guardian_name = Column(String(150), nullable=True)
    guardian_phone = Column(String(20), nullable=True)
    status = Column(
        Enum("Active", "Inactive", "Graduated", "Suspended"),
        nullable=False,
        default="Active",
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    class_info = relationship("Class", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")


class ClassSubject(Base):
    __tablename__ = "class_subject"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    academic_term_id = Column(Integer, ForeignKey("academic_terms.id", ondelete="RESTRICT"), nullable=False)
    credits_override = Column(Integer, nullable=True)
    is_required = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    class_info = relationship("Class", back_populates="class_subjects")
    subject = relationship("Subject", back_populates="class_subjects")
    academic_term = relationship("AcademicTerm", back_populates="class_subjects")
    teachers = relationship("SubjectTeacher", back_populates="class_subject", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="class_subject", cascade="all, delete-orphan")
    schedules = relationship(
        "ClassSchedule",
        back_populates="class_subject",
        cascade="all, delete-orphan",
        primaryjoin=lambda: ClassSubject.id == foreign(ClassSchedule.class_subject_id),
        foreign_keys=lambda: [ClassSchedule.class_subject_id],
    )

    __table_args__ = (
        UniqueConstraint("class_id", "subject_id", "academic_term_id", name="unique_class_subject_term"),
    )


class SubjectTeacher(Base):
    __tablename__ = "subject_teacher"

    id = Column(Integer, primary_key=True, index=True)
    class_subject_id = Column(Integer, ForeignKey("class_subject.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    class_subject = relationship("ClassSubject", back_populates="teachers")
    teacher = relationship("Teacher", back_populates="teaching_assignments")

    __table_args__ = (
        UniqueConstraint("class_subject_id", "teacher_id", name="unique_subject_teacher"),
    )


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_subject_id = Column(Integer, ForeignKey("class_subject.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(Enum("enrolled", "dropped", "completed", "failed"), nullable=False, default="enrolled")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="enrollments")
    class_subject = relationship("ClassSubject", back_populates="enrollments")
    scores = relationship("Score", back_populates="enrollment", cascade="all, delete-orphan")
    attendance_records = relationship(
        "Attendance",
        back_populates="enrollment",
        cascade="all, delete-orphan",
        primaryjoin=lambda: Enrollment.id == foreign(Attendance.enrollment_id),
        foreign_keys=lambda: [Attendance.enrollment_id],
    )

    __table_args__ = (
        UniqueConstraint("student_id", "class_subject_id", name="unique_enrollment"),
        UniqueConstraint("id", "class_subject_id", name="unique_enrollment_id_class_subject"),
    )


class ClassSchedule(Base):
    __tablename__ = "class_schedule"

    id = Column(Integer, primary_key=True, index=True)
    class_subject_id = Column(Integer, nullable=False)
    teacher_id = Column(Integer, nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    day_of_week = Column(
        Enum("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
        nullable=False,
    )
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    lesson_no = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    class_subject = relationship(
        "ClassSubject",
        back_populates="schedules",
        primaryjoin=lambda: ClassSubject.id == foreign(ClassSchedule.class_subject_id),
        foreign_keys=lambda: [ClassSchedule.class_subject_id],
    )
    teacher = relationship(
        "Teacher",
        back_populates="schedules",
        primaryjoin=lambda: Teacher.id == foreign(ClassSchedule.teacher_id),
        foreign_keys=lambda: [ClassSchedule.teacher_id],
    )
    room = relationship("Room", back_populates="schedules")
    attendance_records = relationship(
        "Attendance",
        back_populates="class_schedule",
        cascade="all, delete-orphan",
        primaryjoin=lambda: ClassSchedule.id == foreign(Attendance.class_schedule_id),
        foreign_keys=lambda: [Attendance.class_schedule_id],
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["class_subject_id", "teacher_id"],
            ["subject_teacher.class_subject_id", "subject_teacher.teacher_id"],
            ondelete="RESTRICT",
        ),
        UniqueConstraint("id", "class_subject_id", name="unique_class_schedule_id_class_subject"),
        CheckConstraint("start_time < end_time", name="chk_schedule_time"),
    )


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, index=True)
    score_type = Column(
        Enum("Quiz", "Assignment", "Midterm", "Final", "Practice"),
        nullable=False,
    )
    score = Column(DECIMAL(5, 2), nullable=False)
    max_score = Column(DECIMAL(5, 2), nullable=False, default=10.00)
    weight = Column(DECIMAL(5, 2), nullable=False, default=1.00)
    grade = Column(String(5), nullable=True)
    exam_date = Column(Date, nullable=True)
    remarks = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    enrollment = relationship("Enrollment", back_populates="scores")

    __table_args__ = (
        UniqueConstraint("enrollment_id", "score_type", "exam_date", name="unique_score_component"),
        CheckConstraint("score >= 0 AND max_score > 0 AND score <= max_score", name="chk_score_range"),
    )


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, nullable=False)
    class_schedule_id = Column(Integer, nullable=False)
    class_subject_id = Column(Integer, nullable=False)
    attendance_date = Column(Date, nullable=False)
    status = Column(Enum("Present", "Absent", "Late", "Excused"), nullable=False, default="Present")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    enrollment = relationship(
        "Enrollment",
        back_populates="attendance_records",
        primaryjoin=lambda: Enrollment.id == foreign(Attendance.enrollment_id),
        foreign_keys=lambda: [Attendance.enrollment_id],
    )
    class_schedule = relationship(
        "ClassSchedule",
        back_populates="attendance_records",
        primaryjoin=lambda: ClassSchedule.id == foreign(Attendance.class_schedule_id),
        foreign_keys=lambda: [Attendance.class_schedule_id],
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["enrollment_id", "class_subject_id"],
            ["enrollments.id", "enrollments.class_subject_id"],
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["class_schedule_id", "class_subject_id"],
            ["class_schedule.id", "class_schedule.class_subject_id"],
            ondelete="CASCADE",
        ),
        UniqueConstraint("enrollment_id", "class_schedule_id", "attendance_date", name="unique_attendance"),
    )
