const expect = require("expect");

const { generateMessage } = require("./message");

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
