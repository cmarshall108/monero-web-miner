Monero Web Miner
============
An online fee free, CPU based Monero miner that allows you to mine Monero in your web browser!

Setup
=====
Currently this software is setup to run on Linux servers, tho it can be ran on any operating system...

### Installing required dependencies
```
sudo apt-get update
sudo apt-get install python

wget "https://bootstrap.pypa.io/get-pip.py"
python get-pip.py
rm get-pip.py
pip install tornado

sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get install npm

git clone https://github.com/cazala/coin-hive-stratum.git
cd coin-hive-stratum
npm install -g coin-hive-stratum
cd ..
rm -r coin-hive-stratum

git clone https://github.com/AnythingTechPro/monero-web-miner.git
cd monero-web-miner
```

### Running the Monero Web Miner software
```
screen python main.py
ctrl-a + ctrl-d

bash run_proxy.sh
```

License
=======
Monero Web Miner is licensed under the "BSD 3-Clause License", for more info refer to the "LICENSE" file.
