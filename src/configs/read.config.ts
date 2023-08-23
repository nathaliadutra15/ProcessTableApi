export default () => (
    {
        sqlConfig: {
            server: process.env.DATABASE_SERVER as string,
            database: process.env.DATABASE_NAME as string,
            user: process.env.DATABASE_USER as string,
            password: process.env.DATABASE_PASSWORD as string,
            synchronize: true,
            trustServerCertificate: true,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            },
        }
    }
);