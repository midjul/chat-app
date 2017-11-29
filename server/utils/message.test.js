const expect = require("expect");

const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    const from = "me@dot.com";
    const text = "new test text";

    const res = generateMessage(from, text);
    expect(res).toInclude({ from, text });
    expect(res.createdAt).toExist();
    expect(res.createdAt).toBeA("number");
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    let latitude = 22.22;
    let longitude = 33.33;
    let from = "test";
    let res = generateLocationMessage(from, latitude, longitude);

    expect(res.createdAt).toBeA("number");
    expect(res.from).toBe(from);
    expect(res.url).toBe(
      `https://www.google.com/maps?q=${latitude},${longitude}`
    );
  });
});
