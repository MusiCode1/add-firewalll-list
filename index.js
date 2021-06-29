const exec = require('child_process').exec;
const express = require("express");

require('dotenv').config();

const port = process.env.PORT;
const app = express();

(async function () {
	
	await run(`iptables -A INPUT -p tcp --dport ${port} -j ACCEPT`);
	const res = await run(`/sbin/iptables-save`);

	console.log(res);
})();

app.get("/add_address", async (req, res) => {

	const myIp = req.ip;

	console.log(myIp);

	try {
		await run(`iptables -A INPUT -s ${myIp} -j ACCEPT`);

		await run(`iptables -A INPUT -p tcp --dport ${port} -j ACCEPT`);

		await run(`/sbin/iptables-save`);

		res.end("ok")

	} catch (error) {
		res.end(JSON.stringify(error));
	}

});

app.listen(port, '0.0.0.0', () => {
	console.log(`Running on http://localhost:${port}`);
});

async function run(command) {

	return await new Promise((resolve, reject) => {

		exec(command, (err, stdout, stderr) => {

			if (err) {
				reject(stderr);
			}

			resolve(stdout);
		});
	});
}