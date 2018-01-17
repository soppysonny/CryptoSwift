// Calculate Message Authentication Code (MAC) for message
let key:Array<UInt8> = [1,2,3,4,5,6,7,8,9,10,...]

try Poly1305(key: key).authenticate(bytes)
try HMAC(key: key, variant: .sha256).authenticate(bytes)