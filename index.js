const rls = require("readline-sync");
const { Webhook } = require("discord-webhook-node");
const env = require('dotenv').config().parsed

const AVATAR_URL =  env.AVATAR_URL
const WEBHOOK_URL = env.WEBHOOK_URL
const NAME = env.NAME

if (WEBHOOK_URL == "") {
    print("WEBHOOK_URL not supplied, exiting.\n")
    print("Please run the application like this: `WEBHOOK_URL=\"Your url\" ./webhook_sender` \n")
    print("Or create file `.env` and put `WEBHOOK_URL=\"Your url\" in there\n")
    process.exit(1)
}

const webhook = new Webhook(WEBHOOK_URL);
webhook.setUsername(NAME)
webhook.setAvatar(AVATAR_URL);


function print(...args){
    if (args.length < 2) {
        return process.stdout.write(args[0])
    }
    let str = args[0]
    args = args.slice(1)
    for (let a in args) {
        const arg = args[a];
        str = str.replace(/\{\}/, arg)
    }
    process.stdout.write(str)
}


async function handle_message(inp) {
    if (inp == "" || inp == " ") return
    try {
        await webhook.send(inp);
    }
    catch(e){
        console.log(e.message);
    };
}

async function usage() {
    let help = ""

    help += "Usage: /[command] [arguments]\n"
    help += "    /help                 => Shows this text.\n"
    help += "    /quit, /exit          => Exit the program with exit code 0.\n"
    help += "    /sendfile [file_path] => Sent the file onthe file path.\n"
    help += "    /nick [nickname]      => Change nickname\n"
    help += "    /avatar [avatar_url]  => Change avatar\n"
    console.log(help)
}

async function handle_command(inp) {

    let args = inp.split(" ");
    let command = args.shift()
    switch (command){
        case "/exit":
        case "/quit":
            process.exit(0)
            break
        case "/sendfile":
            try {
                await webhook.sendFile(args.join(' '));
            }
            catch(e){
                console.log(e.message);
            };
            break
        case "/nick":
            await webhook.setUsername(args.join(' '))
            break
        case "/avatar":
            await webhook.setAvatar(args.join(' '))
            break
        case "/h":
        case "/help":
            await usage()
            break
        default:
            print("ERR: Unknown Command `{}`\n", inp)

    }
}


async function main() {
    // console.log(WEBHOOK_URL
    while (true) {
        const inp = rls.question("wh> ");
        if (inp[0] == "/"){
            await handle_command(inp);
        } else {
            await handle_message(inp);
        }
    }
}
// console.log(env)

(async () => {
    await main();
})();