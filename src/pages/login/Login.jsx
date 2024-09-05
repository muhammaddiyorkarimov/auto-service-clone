import { useState } from 'react'
import UiInput from '../../UI/input/UiInput'
import './login.css'
import images from '../../images'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../features/slice/authSlice'
import { useNavigate } from 'react-router-dom'
import ValidationError from '../../helpers/ValidationError'

function Login() {
    const [branch, setBranch] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [active, setActive] = useState(false)


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, loading, error } = useSelector(state => state.auth)
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await dispatch(loginUser({ username, password })).unwrap()
            if (response) {
                navigate('/')
            }
        } catch (error) {

        }

    }

    const handleOpenBranches = () => {
        setActive(!active)
    }

    const handleBranchSelect = (branchName) => {
        setBranch(branchName)
        setActive(false)
    }

    return (
        <div className='login-page'>
            {error && <ValidationError/>}
            <div className="title">
                <h1>Вход</h1>
                <p>Войдите в приложение, введя данные учетной записи</p>
            </div>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    {/* <label onClick={handleOpenBranches} className={`input-wrapper branches ${active ? 'active' : ''}`}>
                        <div className='branch-title'>
                            <img src={images.branch} alt="" />
                            <span>{branch || 'Branches'}</span>
                        </div>
                        <div className="dropdown">
                            <span onClick={() => handleBranchSelect('Branch 1')}>Branch 1</span>
                            <span onClick={() => handleBranchSelect('Branch 2')}>Branch 2</span>
                            <span onClick={() => handleBranchSelect('Branch 3')}>Branch 3</span>
                        </div>
                        <i className="fa-solid fa-chevron-down"></i>
                    </label> */}
                    <label className="input-wrapper">
                        <img src={images.user} alt="" />
                        <UiInput
                            type="text"
                            state={username}
                            setState={setUsername}
                            placeholder="Имя пользователя..."
                        />
                    </label>
                    <label className="input-wrapper">
                        <img src={images.password} alt="" />
                        <UiInput
                            type="password"
                            placeholder="Пароль..."
                            state={password}
                            setState={setPassword}
                        />
                    </label>
                    <button type="submit" disabled={loading}>{loading ? 'Загрузка...' : 'Вход'}</button>
                </form>
            </div>
        </div>
    )
}

export default Login
