import React from 'react'

function UiInput({ placeholder, type, state, setState }) {
    return (
        <div className='ui-input'>
            <input
                type={type}
                placeholder={placeholder}
                value={state}
                onChange={(e) => setState(e.target.value)}
            />
        </div>
    )
}

export default UiInput