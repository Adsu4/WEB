const fs = require('fs');

const userString = "john:john@gect krishnapriya:krishnapriya@gect ihan:ihan@sct ramees:ramees@gect rahul:rahul@sct devika:devika@gect adwaidh:adwaidh@gect aleena:aleena@gect gautam:gautam@gect ajay:ajay@sct roshan:roshan@nitt abid:abid@gect charles:charles@gect karthik:karthik@gect archana:archana@cet aleena:aleena@gect salos:salos@newbieselflearning krishna:krishna@gect jeril:jeril@gect meenapreya:meenapreya@ceg gaayathry:gaayathry@sce george:george@saintgitscollegeofengineering karthika:karthika@gect alvin:alvin@thrissurgovernmentengineeringcollege aashlyn:aashlyn@gect";

const pairs = userString.split(' ');
const usersObj = { "admin": "maker123" }; // KEEP ADMIN

for (const pair of pairs) {
  if (pair.trim() === '') continue;
  const [username, password] = pair.split(':');
  usersObj[username] = password;
}

const envContent = "VITE_ACCESS_PASSCODE=maker123\\nVITE_USERS=" + JSON.stringify(usersObj) + "\\n";

fs.writeFileSync('.env', envContent);
console.log('Updated .env');
