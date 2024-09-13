import axios from "axios";
import qs from "qs";
import mongoose from "mongoose";
import PhoneNumber from "./phoneNumber";

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://melkmeshi:MohElk13241@cluster0.95fnsnb.mongodb.net/menus?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db");
    test();
  })
  .catch((err) => {
    console.log(err.message);
  });

function generateRandomDigits(numDigits: number): string {
  let digits = "";
  for (let i = 0; i < numDigits; i++) {
    digits += Math.floor(Math.random() * 10); // Generate a random integer between 0 and 9
  }
  return digits;
}
function removeDuplicates(arr: string[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
async function getPhoneNames(phoneNumber: string): Promise<string[] | null> {
  let pageID = 0;
  const names: string[] = [];
  while (true) {
    let data = qs.stringify({
      number: phoneNumber,
      name: 0,
      page_id: pageID,
      device_id: `${generateRandomDigits(2)}e${generateRandomDigits(
        1
      )}d${generateRandomDigits(1)}f${generateRandomDigits(
        1
      )}f${generateRandomDigits(2)}d${generateRandomDigits(3)}`,
      number_phone: "Hand55Shake@Hand56Shake&Hand57Shake",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://appsn.website/lookup/API/API/search_all2.php",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    const response = await axios.request(config);
    if (response.data) {
      if (response.data.list.length > 0) {
        response.data.list.forEach((element: any) => {
          names.push(element.contact_name);
        });
      } else {
        if (pageID === 0) return null;

        return removeDuplicates(names);
      }
      pageID++;
    } else {
      return null;
    }
  }
}
async function getPhoneName(phoneNumber: string): Promise<string> {
  let data = qs.stringify({
    number: phoneNumber,
    name: "0",
    device_id: "68e7d8f93f20d322",
    number_phone: "Hand24Shake@Hand45Shake&Hand26Shake",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://appsn.website/lookup/API/API/search3.php",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  const response = await axios.request(config);
  if (response.data.length > 0) {
    return response.data[0]["contact_name"];
  } else {
    return "للاسف مالقيتاش";
  }
}

const test = async () => {
  const prefix = "091";
  for (let i = 55; i < 10000000; i++) {
    const phone = `${prefix}${i.toString().padStart(7, "0")}`;
    console.log(phone);
    const names = await getPhoneNames(phone);
    if (names) {
      await PhoneNumber.create({ phone, names });
      console.log({ phone, names });
    }
  }
};
