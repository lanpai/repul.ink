function Social(props) {
    const { text, color, type } = props;

    return (
        <a href='/'>
            <div className='social' style={{ backgroundColor: color }}>
                <span>{ text }</span>
                <i className={ `fab fa-${type}` }></i>
            </div>
        </a>
    );
}

export default Social;
