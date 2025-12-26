const fs = require('fs');

function processPacket(data) {
  // Tạo một buffer nhỏ (chỉ 4 bytes)
  const buf = Buffer.alloc(4);

  // ---------------------------------------------------------
  // ❌ LỖI 1: Ghi số nguyên 8-bit với noAssert = true
  // Semgrep bắt: writeUInt8(..., true)
  // Nếu offset (10) lớn hơn độ dài buffer (4), nó vẫn cố ghi đè -> Crash/RCE
  // ---------------------------------------------------------
  buf.writeUInt8(0xff, 10, true);

  // ---------------------------------------------------------
  // ❌ LỖI 2: Ghi số thực (Double - 8 bytes) vào buffer 4 bytes
  // Semgrep bắt: writeDoubleBE(..., true)
  // ---------------------------------------------------------
  const value = 123.456;
  const offset = 0;
  buf.writeDoubleBE(value, offset, true);

  // ---------------------------------------------------------
  // ❌ LỖI 3: Ghi số nguyên 32-bit (Int32)
  // Semgrep bắt: writeInt32LE(..., true)
  // ---------------------------------------------------------
  buf.writeInt32LE(99999, 0, true);

  // ---------------------------------------------------------
  // ❌ LỖI 4: Ghi Float
  // Semgrep bắt: writeFloatLE(..., true)
  // ---------------------------------------------------------
  buf.writeFloatLE(3.14, 0, true);

  // ---------------------------------------------------------
  // ✅ CÁC TRƯỜNG HỢP AN TOÀN (Rule sẽ BỎ QUA)
  // ---------------------------------------------------------

  // An toàn: Mặc định Node.js sẽ kiểm tra bounds (không có tham số true)
  try {
    buf.writeUInt8(0xff, 10); // Sẽ ném lỗi ERR_OUT_OF_RANGE
  } catch (e) {
    console.log('Safe: Error caught');
  }

  // An toàn: Set noAssert = false (tường minh)
  buf.writeInt16BE(100, 0, false);
}

module.exports = processPacket;
