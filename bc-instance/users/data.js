const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // secp256k1 is the algorithm used in bitcoin

const johnsKey = ec.genKeyPair();
const janesKey = ec.genKeyPair();
const alicesKey = ec.genKeyPair();
// publicKey: key.getPublic("hex")
// privateKey: key.getPrivate("hex")

const users = [
  {
    id: 1,
    username: "john_doe",
    password: "password",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    age: 30,
    maltBalance: 100,
    publicKey: johnsKey.getPublic("hex"),
    privateKey: johnsKey.getPrivate("hex"),
    isAdmin: false,
  },
  {
    id: 2,
    username: "jane_smith",
    password: "password",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
    maltBalance: 20,
    publicKey: janesKey.getPublic("hex"),
    privateKey: janesKey.getPrivate("hex"),
    isAdmin: true,
  },
  {
    id: 3,
    username: "alice_wonderland",
    password: "password",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Wonderland",
    age: 28,
    maltBalance: 50,
    publicKey: alicesKey.getPublic("hex"),
    privateKey: alicesKey.getPrivate("hex"),
    isAdmin: false,
  },
];

export default users;
