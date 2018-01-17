let password: Array<UInt8> = Array("s33krit".utf8)
let salt: Array<UInt8> = Array("nacllcan".utf8)

try PKCS5.PBKDF2(password: password, salt: salt, iterations: 4096, variant: .sha256).calculate()