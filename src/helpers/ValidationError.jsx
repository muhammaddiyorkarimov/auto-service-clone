import './validationError.css';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function ValidationError() {
    const { error } = useSelector(state => state.auth);
    const [visible, setVisible] = useState(true);

    const errorMessage = useCallback(() => {
        if (!error) return [];
        return Object.keys(error).map(name => {
            const msg = Array.isArray(error[name]) ? error[name].join(', ') : error[name];
            return `${name} - ${msg}`;
        });
    }, [error]);

    useEffect(() => {
        if (error) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (!visible) return null;

    return (
        <div className='validation-error'>
            {errorMessage().map((err, index) => (
                <div key={index}>
                    {err === 'detail - Активная учетная запись с указанными учетными данными не найдена' ? 
                        "Такой пользователь не найден" : err}
                </div>
            ))}
        </div>
    );
}

export default ValidationError;
