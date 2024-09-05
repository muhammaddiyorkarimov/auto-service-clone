import './hasError.css'

function HasError({error}) {
  return (
    <div className='not-available'>
        <div>{error}</div>
    </div>
  )
}

export default HasError