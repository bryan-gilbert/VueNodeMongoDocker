# MongoDB
> Securing MongoDB  

## Authentication

Pass the root user name and password into the application via environment variables.  See the sections in the documentation 
about [docker](/server/docker.md) 

> TODO read this [https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/mongodb-security-weaknesses-in-a-typical-nosql-database/](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/mongodb-security-weaknesses-in-a-typical-nosql-database/)

Recommendations from that article include:
- Disabling the default status page – using the 'nohttpinterface' option to turn off the 28017 port.
- Use a different port – using the 'port' option
- Do not enable REST in production environments – don't use 'rest' option
- Bind the mongodb process to only one interface/IP – using the 'bind_ip'
- Don't run mongodb daemon as root
- Disable anonymous access – using the 'auth' option
- Encrypt data - "To support audit requirements, you may need to encrypt data stored in MongoDB. For best results you can encrypt this data in the application layer, by encrypting the content of fields that hold secure data."
- Encrypt communication – Recommended to use SSL


Also see
- [https://medium.com/rahasak/enable-mongodb-authentication-with-docker-1b9f7d405a94](https://medium.com/rahasak/enable-mongodb-authentication-with-docker-1b9f7d405a94)
- [https://docs.mongodb.com/manual/tutorial/enable-authentication/](https://docs.mongodb.com/manual/tutorial/enable-authentication/)
- [https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password](https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password)
- [https://docs.bitnami.com/bch/apps/lets-chat/administration/change-reset-password/](https://docs.bitnami.com/bch/apps/lets-chat/administration/change-reset-password/)


## Mongoose
- [https://mongoosejs.com/docs/api.html#](https://mongoosejs.com/docs/api.html#)
