# Server setup

## SSH Key
On your development box use ```openssh``` to generate a public private key
```
export KF=may14-ecdsa

# Generate key, enter pass phrase when prompted
ssh-keygen -t ecdsa -b 256 -f $KF
# More secure options:
# ssh-keygen -t ecdsa -b 384
# ssh-keygen -t ecdsa -b 521

# OR with RSA
# export KF=may14-rsa
# ssh-keygen -t rsa -b 4096 -f may14-rsa

```
Link copy into default key folder

```
ln -s $KF ~/.ssh/$KF
ln -s $KF.pub ~/.ssh/$KF.pub
ls -al ~/.ssh

# register ssh key in your local environment, enter passphrase when prompted
ssh-add $KF

# See the public key.  Select the text and use it below in the PKS env variable
cat $KF.pub
```

## Digital Ocean server setup
- Log onto DO
- create a droplet; Debian, 1GB ($5/mth) Toronto or San Fran
- add ssh key (see above)
- name Droplet 'May14 x'


## First log on

You might use this to generate a reasonable password for a new user. Run on your the new server.
```
# generate random password for user

PW=$(date +%s|sha256sum|base64|head -c 8)
echo ------------------ SAVE THIS: $PW
 
```

Do log onto the new server copy the IP address from DO control panel and ssh in.

```
export SERVER=159.89.117.81
ssh root@$SERVER

```

Prepare the system.  You can modify the leading environment variables and then copy paste the following into your root ssh session.

```
# export PKS='replace with the contents of the public key file on your development box'
export PKS='ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBIrLLdQGnMofGqBWFnapwWORcxM4lU64bBmkVqWjq2VzrrBKzAhKgSSUzwOpRNV2yqusT46M+iMWt9rx1d9keEA='
export UN=may14
export UH=/home/$UN
export PW=YzFmYWEw



echo adding a favorite alias
alias ll='ls -lahG'

echo Set timezone
timedatectl set-timezone America/Vancouver

echo DigitalOcean recommends next line. See https://www.digitalocean.com/community/questions/debian-9-3-droplet-issues-with-useradd
apt-get remove -y unscd

echo Update system
apt-get update & apt-get -y upgrade

echo Installing essentials
apt-get install -y sudo curl git-core

addgroup ssh-access

echo Create user: $UN
# Create the user; add to group; create home directory (-m); set password hashed
# useradd -G users,sudo,www-data,ssh-access -m -s /bin/bash -p $(echo $PW | openssl passwd -1 -stdin) $UN
useradd -G users,sudo,ssh-access -m -s /bin/bash -p $(echo $PW | openssl passwd -1 -stdin) $UN

echo Stash favourite alias in shell init for user
echo "alias ll='ls -lahG'" >> $UH/.bashrc 

echo User created to remove the user created run 
echo   deluser $UN

echo Show information about the user: 
getent passwd $UN
id -Gn $UN

echo Placing SSH keys into users home directory  
mkdir -p $UH/.ssh
echo $PKS >> $UH/.ssh/authorized_keys
cat $UH/.ssh/authorized_keys

chmod 700 $UH/.ssh
chmod 600 $UH/.ssh/*
chown -R $UN:$UN $UH/.ssh

```

Return to your development machine and open another terminal session and test logging on as as the new user. Try out ```sudo``` too.

> On your development workstation:
```
# on dev
echo Log into server $SERVER as user 
ssh may14@$SERVER
```
(recall SERVER was setup on your dev instance above)

> On the server check that user can use ```sudo```
```
# on the server
sudo su
# enter the user password to become sudoer
```

At this point you have a new server with a new user which can log on and run sudo commands.  Let's 
secure the site and prevent 
- password log on
- change the default port
- disable root ssh access
- allow users in the ssh-access group to ssh onto the machine

```
# on the server
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# remove the existing file. Copy the text in the local copy of sshd_config here in this documentation. Paste into the server side.
# Paste with control characters.
sudo rm /etc/ssh/sshd_config
sudo nano /etc/ssh/sshd_config 
sudo diff /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo cp /etc/ssh/sshd_config.bak /etc/ssh/sshd_config
```
Add or change the following:
``` 
Port 2201
PermitRootLogin no
PasswordAuthentication no
# add this to avoid problem with multiple sshd processes
ClientAliveInterval 600
ClientAliveCountMax 3
AllowGroups ssh-access
```
Restart the ssh service:
``` 
# on the server
sudo service ssh restart
```

## Firewall

``` 
sudo apt-get install -y ufw
```

Then set up the firewall.  Allow the port you set for ssh above
```
sudo ufw default deny incoming
sudo ufw default allow outgoing

# open ssh port
sudo ufw allow 8201/tcp
sudo ufw deny ssh

# open http port
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# open ntp port : to sync the clock of your machine
sudo ufw allow 123/udp

# turn on firewall
sudo ufw enable

# check the status
sudo ufw status
```

Should report:
``` 
Status: active

To                         Action      From
--                         ------      ----
8201/tcp                   ALLOW       Anywhere                  
22/tcp                     DENY        Anywhere                  
80/tcp                     ALLOW       Anywhere                  
443/tcp                    ALLOW       Anywhere                  
123/udp                    ALLOW       Anywhere                  
8201/tcp (v6)              ALLOW       Anywhere (v6)             
22/tcp (v6)                DENY        Anywhere (v6)             
80/tcp (v6)                ALLOW       Anywhere (v6)             
443/tcp (v6)               ALLOW       Anywhere (v6)             
123/udp (v6)               ALLOW       Anywhere (v6)
```

Next time you log in don't forget the ssh port has changed
```
ssh may14@159.203.14.23 -p 8201 
```

