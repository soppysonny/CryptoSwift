let password: Array<UInt8> = Array("s33krit".utf8)
let salt: Array<UInt8> = Array("nacllcan".utf8)

try HKDF(password: password, salt: salt, variant: .sha256).calculate()