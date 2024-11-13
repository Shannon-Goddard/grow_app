// 1. First, import modules using ES modules syntax
import { SecretsManagerClient, GetSecretValueCommand } from 'https://cdn.skypack.dev/@aws-sdk/client-secrets-manager';
import { ProductAdvertisingAPIv1 } from 'https://cdn.skypack.dev/paapi5-nodejs-sdk';

// 2. Make the code async/await
async function getAmazonSecrets() {
    const secret_name = "prod/amazon/pass";
    
    const client = new SecretsManagerClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT"
            })
        );
        return JSON.parse(response.SecretString);
    } catch (error) {
        console.error('Error fetching secrets:', error);
        throw error;
    }
}

// 3. Main function to handle Amazon Product API
async function getProductDetails() {
    try {
        // Get secrets
        const secrets = await getAmazonSecrets();
        
        // Configure the client
        const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
        defaultClient.accessKey = secrets.accessKey;
        defaultClient.secretKey = secrets.secretKey;
        defaultClient.host = 'webservices.amazon.com';
        defaultClient.region = 'us-east-1';

        const api = new ProductAdvertisingAPIv1.DefaultApi();

        // Create request
        const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();
        getItemsRequest.PartnerTag = '42009b1-20';
        getItemsRequest.PartnerType = 'Associate';
        getItemsRequest.ItemIds = ['B08LGP2N34'];
        getItemsRequest.Condition = 'New';
        getItemsRequest.Resources = [
            'Images.Primary.Medium',
            'ItemInfo.Title',
            'Offers.Listings.Price'
        ];

        // Make API call
        const data = await api.getItems(getItemsRequest);
        return processResponse(data);

    } catch (error) {
        console.error('Error in getProductDetails:', error);
        throw error;
    }
}

// 4. Helper functions
function processResponse(data) {
    const getItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
    
    if (getItemsResponse.ItemsResult?.Items) {
        return getItemsResponse.ItemsResult.Items.reduce((acc, item) => {
            acc[item.ASIN] = {
                asin: item.ASIN,
                url: item.DetailPageURL,
                title: item.ItemInfo?.Title?.DisplayValue,
                price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount
            };
            return acc;
        }, {});
    }
    
    return null;
}

// 5. Usage
async function init() {
    try {
        const products = await getProductDetails();
        console.log('Products:', products);
    } catch (error) {
        console.error('Error in init:', error);
    }
}

// 6. Start the application
init();