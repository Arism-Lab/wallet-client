type Instruction = {
    name: string
    description: string
}
type NodeState = {
    id: number
    value: string
}
type Step<T> = {
    instruction: Instruction
    state: T
    privateKeyInput?: boolean
    passwordInput?: boolean
}
type NetworkFactorSteps = [Step<NodeState[]>, Step<NodeState[]>, Step<NodeState[]>, Step<NodeState[]>, Step<string>]
type SignInOauthSteps = [Step<string>, Step<string>, Step<string>]
type SignInOauthAndPasswordSteps = [Step<string>, Step<string[]>, Step<string>]
type SignInPasswordSteps = [Step<string>, Step<string[]>, Step<string>]
type SignUpSteps = [Step<string>, Step<string>, Step<string>]

type LoginMethod = 'signInOauth' | 'signInPassword' | 'signInOauthAndPassword' | 'signUp'
type LoginStepsForAllMethods = ExactKeys<
    {
        signInOauth: Concat<[NetworkFactorSteps, SignInOauthSteps]>
        signInOauthAndPassword: Concat<[NetworkFactorSteps, SignInOauthAndPasswordSteps]>
        signInPassword: Concat<[SignInPasswordSteps]>
        signUp: Concat<[NetworkFactorSteps, SignUpSteps]>
    },
    LoginMethod
>
type LoginSteps = LoginStepsForAllMethods[LoginMethod]
type LoginStep = LoginSteps[any]
type GenericStep = LoginStep extends Step<infer U> ? U : never
