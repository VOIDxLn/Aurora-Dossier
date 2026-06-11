import { authRepository } from '../repositories/authRepository';

export const authService = {
    login:            (email, password) => authRepository.signIn(email, password),
    logout:           ()                => authRepository.signOut(),
    getUser:          ()                => authRepository.getUser(),
    signUp:           (email, password) => authRepository.signUp(email, password),
    signUpIsolated:   (email, password) => authRepository.signUpIsolated(email, password),
    signUpNoSession:  (email, password) => authRepository.signUpIsolated(email, password),
    updatePassword:   (password)        => authRepository.updatePassword(password),
    onAuthStateChange:(callback)        => authRepository.onAuthStateChange(callback),
};
