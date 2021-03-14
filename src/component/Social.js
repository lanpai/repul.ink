function Social({ text, color, type, link }) {
    return (
        <a href={ link }>
            <div className='social' style={{ backgroundColor: color }}>
                <span>{ text }</span>
                <i className={ `fab fa-${type}` }></i>
            </div>
        </a>
    );
}

export default Social;
