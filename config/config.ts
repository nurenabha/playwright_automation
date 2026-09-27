export const reportingTool = {
    loginUrl: 'https://attend-millennium-src-opt.trycloudflare.com/login',
    forgotPasswordUrl: 'https://attend-millennium-src-opt.trycloudflare.com/forgot-password',
    validEmail: 'user@organization.com',
    invalidEmail: 'user@org'
};


export const loginData = {
    validEmail: process.env.LOGIN_EMAIL ?? reportingTool.validEmail,
    validPassword: process.env.LOGIN_PASSWORD ?? '',
    unknownEmail: 'invalid@example.com',
    nonexistentEmail: 'nonexistent@example.com',
    wrongPassword: 'WrongPassword123',
    validFormatPassword: 'ValidPassword123',
    malformedEmail: 'abc.com',
    sampleMaskedPassword: 'Password123'
};
