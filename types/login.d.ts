type LoginMethod =
    | 'signInOauth'
    | 'signInPassword'
    | 'signInOauthAndPassword'
    | 'signUp'
    | 'lost'
type Instruction = {
    name: string
    description: string
}
type NodeState = {
    node: number
    value: string
}
type Step = {
    instruction: Instruction
    state: NodeState[] | string[] | string | undefined
    privateKeyInput?: boolean
    passwordInput?: boolean
}
type SignInOauthSteps = {
    networkFactorStep1: Step
    networkFactorStep2: Step
    networkFactorStep3: Step
    networkFactorStep4: Step
    networkFactorStep5: Step
    deviceFactorStep1: Step
    privateFactorStep1: Step
    verifyStep: Step
}
type SignInOauthAndPasswordSteps = {
    networkFactorStep1: Step
    networkFactorStep2: Step
    networkFactorStep3: Step
    networkFactorStep4: Step
    networkFactorStep5: Step
    recoveryFactorStep1: Step
    recoveryFactorStep2: Step
    verifyStep: Step
}
type SignInPasswordSteps = {
    recoveryFactorStep1: Step
    recoveryFactorStep2: Step
    verifyStep: Step
}
type SignUpSteps = {
    networkFactorStep1: Step
    networkFactorStep2: Step
    networkFactorStep3: Step
    networkFactorStep4: Step
    networkFactorStep5: Step
    privateFactorStep1: Step
    deviceFactorStep1: Step
    verifyStep: Step
}
type LoginState =
    | SignInOauthSteps
    | SignInOauthAndPasswordSteps
    | SignInPasswordSteps
    | SignUpSteps
type LoginReducer = {
    data: LoginState
    error: any
    loading: boolean
}
