const reducer = (state, action) => {
    switch (action.type) {
        case "PASSWORD_RECOVERY_SENT":
            return {
                ...state,
                forgot: false,
                headerText: "",
                passwordReset: true
            }
        case "SET_FORGOT":
            return {
                ...state,
                footerLinkText: "Sign In",
                footerText: "Already have an account?",
                forgot: true,
                headerText: "Reset your password",
                login: false,
                register: false,
                showFooter: false
            }
        case "SET_LOGIN":
            return {
                ...state,
                footerLinkText: "Create an account",
                footerText: "New to this site?",
                forgot: false,
                headerText: "Sign In",
                login: true,
                register: false,
                showFooter: true
            }
        case "SET_REGISTER":
            return {
                ...state,
                footerLinkText: "Sign in",
                footerText: "Already have an account?",
                forgot: false,
                headerText: "Sign Up",
                login: false,
                register: true,
                showFooter: true
            }
        case "SET_VERIFY":
            return {
                ...state,
                footerLinkText: "",
                footerText: "",
                forgot: false,
                headerText: "Verify your email",
                login: false,
                register: false,
                showFooter: false
            }
        default:
            throw new Error()
    }
}

export default reducer
