import forge from 'node-forge';

const keySize = 24;
const ivSize = 8;

function encrypt(pass, message) {
    const salt = forge.random.getBytesSync(8);
    const derivedBytes = forge.pbe.opensslDeriveBytes(
        pass, salt, keySize + ivSize
    );
    const buffer = forge.util.createBuffer(derivedBytes);
    const key = buffer.getBytes(keySize);
    const iv = buffer.getBytes(ivSize);

    const cipher = forge.cipher.createCipher('3DES-CBC', key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();

    const output = forge.util.createBuffer();

    if (salt !== null) {
        output.putBytes('Salted__');
        output.putBytes(salt);
    }
    output.putBuffer(cipher.output);

    return output.getBytes();
}

function decrypt(pass, message) {
    const input = forge.util.createBuffer(message);

    input.getBytes('Salted__'.length);

    const salt = input.getBytes(8);

    const derivedBytes = forge.pbe.opensslDeriveBytes(
        pass, salt, keySize + ivSize);
    const buffer = forge.util.createBuffer(derivedBytes);
    const key = buffer.getBytes(keySize);
    const iv = buffer.getBytes(ivSize);

    const decipher = forge.cipher.createDecipher('3DES-CBC', key);
    decipher.start({ iv });
    decipher.update(input);
    decipher.finish();

    return decipher.output.toString();
}

export {
    encrypt, decrypt
};
