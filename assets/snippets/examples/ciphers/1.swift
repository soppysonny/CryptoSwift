let encrypted = try ChaCha20(key: key, iv: iv).encrypt(message)
let decrypted = try ChaCha20(key: key, iv: iv).decrypt(encrypted)