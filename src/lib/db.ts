import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export type Role = 'student' | 'parent' | 'admin' | 'visitor';
export type Status = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Only for demo purposes
  role?: Role;
  status?: Status;
  studentId?: string | null;
  class?: number | null;
  section?: "A" | "B" | "IoT" | "GEW" | "CCS" | "RAC" | null;
  guardianPhone?: string | null;
  phone?: string | null;
  linkedChildId?: string | null;
  photoUrl?: string | null;
  createdAt?: number;
}

export const getDbUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return undefined;
  }
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as User;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return undefined;
  }
};

export const createUser = async (user: Omit<User, 'id'> & { id?: string }): Promise<User | null> => {
  const insertData: User = {
    id: user.id || crypto.randomUUID(),
    email: user.email,
    name: user.name || '',
    password: user.password || '',
    role: user.role || 'visitor',
    status: user.status || 'pending',
    studentId: user.studentId || null,
    class: user.class || null,
    section: user.section || null,
    phone: user.phone || null,
    linkedChildId: user.linkedChildId || null,
    createdAt: Date.now()
  };
  
  try {
    await setDoc(doc(db, 'users', insertData.id), insertData);
    return insertData;
  } catch (error: any) {
    console.error('Error creating user:', error, insertData);
    alert('Database Error: ' + (error?.message || 'Unknown error'));
    return null;
  }
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.data() as User;
  } catch (error: any) {
    console.error('Error updating user:', error, updates);
    alert('Database Error during profile update: ' + (error?.message || 'Unknown error'));
    return null;
  }
};

// Verify if a student exists and the guardian phone matches
export const verifyStudentForParent = async (studentId: string, guardianPhone: string): Promise<{ success: boolean; message?: string; studentName?: string }> => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, message: 'Student ID does not match our records' };
    }
    
    const student = querySnapshot.docs[0].data() as User;
    
    if (student.phone !== guardianPhone && student.guardianPhone !== guardianPhone) {
      return { success: false, message: 'Phone number does not match our records' };
    }
    
    return { success: true, studentName: student.name };
  } catch (error) {
    console.error('Error verifying student:', error);
    return { success: false, message: 'An error occurred during verification' };
  }
};

// Mock validation for parent checking child student ID
export const validateStudentIdExists = async (studentId: string): Promise<boolean> => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
      
    if (!querySnapshot.empty) return true;
    
    // Also accept any ID starting with 'STU' for testing purposes
    return studentId.toUpperCase().startsWith('STU');
  } catch (error) {
    console.error('Error validating student ID:', error);
    return false;
  }
};

// --- NEW CMS FUNCTIONS ---

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: string;
  fileUrl?: string;
  linkUrl?: string;
  createdAt: number;
}

export interface ExamResult {
  id: string;
  title: string;
  year: string;
  resultsData: string; // JSON string
  createdAt: number;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  createdAt: number;
}

export interface SiteContent {
  id: string;
  [key: string]: any;
}

// Notices
export const getNotices = async (): Promise<Notice[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'notices'));
    return querySnapshot.docs.map(doc => doc.data() as Notice).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
};

export const createNotice = async (notice: Omit<Notice, 'id'> & { id?: string }): Promise<Notice | null> => {
  const insertData: Notice = {
    id: notice.id || crypto.randomUUID(),
    ...notice,
    createdAt: notice.createdAt || Date.now()
  };
  try {
    await setDoc(doc(db, 'notices', insertData.id), insertData);
    return insertData;
  } catch (error) {
    console.error('Error creating notice:', error);
    return null;
  }
};

export const updateNotice = async (id: string, updates: Partial<Notice>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'notices', id), updates);
    return true;
  } catch (error) {
    console.error('Error updating notice:', error);
    return false;
  }
};

export const deleteNotice = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'notices', id));
    return true;
  } catch (error) {
    console.error('Error deleting notice:', error);
    return false;
  }
};

// Exams (Results)
export const getExams = async (): Promise<ExamResult[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'exams'));
    return querySnapshot.docs.map(doc => doc.data() as ExamResult).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
};

export const createExam = async (exam: Omit<ExamResult, 'id'> & { id?: string }): Promise<ExamResult | null> => {
  const insertData: ExamResult = {
    id: exam.id || crypto.randomUUID(),
    ...exam,
    createdAt: exam.createdAt || Date.now()
  };
  try {
    await setDoc(doc(db, 'exams', insertData.id), insertData);
    return insertData;
  } catch (error) {
    console.error('Error creating exam:', error);
    return null;
  }
};

export const updateExam = async (id: string, updates: Partial<ExamResult>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'exams', id), updates);
    return true;
  } catch (error) {
    console.error('Error updating exam:', error);
    return false;
  }
};

export const deleteExam = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'exams', id));
    return true;
  } catch (error) {
    console.error('Error deleting exam:', error);
    return false;
  }
};

// Teachers
export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'teachers'));
    return querySnapshot.docs.map(doc => doc.data() as Teacher).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
};

export const createTeacher = async (teacher: Omit<Teacher, 'id'> & { id?: string }): Promise<Teacher | null> => {
  const insertData: Teacher = {
    id: teacher.id || crypto.randomUUID(),
    ...teacher,
    createdAt: teacher.createdAt || Date.now()
  };
  try {
    await setDoc(doc(db, 'teachers', insertData.id), insertData);
    return insertData;
  } catch (error) {
    console.error('Error creating teacher:', error);
    return null;
  }
};

export const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'teachers', id), updates);
    return true;
  } catch (error) {
    console.error('Error updating teacher:', error);
    return false;
  }
};

export const deleteTeacher = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'teachers', id));
    return true;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return false;
  }
};

// Site Content
export const getSiteContent = async (id: string): Promise<SiteContent | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'site_content', id));
    if (docSnap.exists()) {
      return docSnap.data() as SiteContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching site content:', error);
    return null;
  }
};

export const updateSiteContent = async (id: string, data: Partial<SiteContent>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'site_content', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, { id, ...data });
    }
    return true;
  } catch (error) {
    console.error('Error updating site content:', error);
    return false;
  }
};
