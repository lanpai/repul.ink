import Social from './Social';

function ID() {
    const name = 'Jihoon Yang';
    const blurb = 'technology enthusiast';
    const keyDecrypt = '2D4A614E645267556B58703272357538782F413F4428472B4B6250655368566D';

    return (
        <div className='id'>
            <h1>{ name }</h1>
            <p>{ blurb }</p>
            <div>
                <div style={{ display: 'inline-block' }}>
                    <Social text='Jihoon Yang (@lanpai)' color='#1DA1F2' type='twitter' />
                    <Social text='Jihoon Yang (@lanpai)' color='#24292E' type='github' />
                    <Social text='Jihoon Yang' color='#4267B2' type='facebook' />
                </div>
            </div>
            <i className='soft' style={{ wordBreak: 'break-all' }}>{ keyDecrypt }</i>
        </div>
    );
}

export default ID;
