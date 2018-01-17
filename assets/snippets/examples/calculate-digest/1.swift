/* Hash struct usage */
let bytes:Array<UInt8> = [0x01, 0x02, 0x03]
let digest = input.md5()
let digest = Digest.md5(bytes)
let data = Data(bytes: [0x01, 0x02, 0x03])

let hash = data.md5()
let hash = data.sha1()
let hash = data.sha224()
let hash = data.sha256()
let hash = data.sha384()
let hash = data.sha512()    
do {
  var digest = MD5()
  let partial1 = try digest.update(withBytes: [0x31, 0x32])
  let partial2 = try digest.update(withBytes: [0x33])
  let result = try digest.finish()
} catch { }