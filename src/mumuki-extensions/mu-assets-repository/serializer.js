/**
 * Provides an interface for serializing and deserializing well-known assets
 * to avoid posting unnecessary information to the solution
*/

const wellKnownAssets = require('./repository.json');

const serializeMuAssets = function(assets, type) {
    return assets.map(asset => {
        if(shouldReplace(asset, type)){
            asset.muAsset = true;
            asset.type = type;
            asset.fileContent = "";
        }
        return asset;
    })
};

const shouldReplace = function(asset, type) {
    return wellKnownAssets[type].includes(asset.fileName);
};

const getAssetType = function(type, ext, storage) {
    let AssetType = storage.AssetType;
    let assetType = assetTypeFunctions[type]();
    return AssetType[assetType];
};

const soundAssetType = function() {
   return 'Sound';
};

const costumeAssetType = function (ext) {
    if (ext === 'svg') {
        return 'ImageVector';
    } else {
        return 'ImageBitmap';
    }
};

const assetTypeFunctions = {
    'sound': soundAssetType,
    'costume': costumeAssetType
};

const deserializeMuAssets = function(assets, type, storage) {
    return Promise.all(assets.map(asset => deserializeMuAsset(asset, type, storage)))
};

const deserializeMuAsset = function(asset, type, storage) {
    if(asset.muAsset) {
        [md5, ext] = asset.fileName.split(".");
        let assetType = getAssetType(type, ext, storage);
        return storage.load(assetType, md5, ext).then(response => {
            asset.fileContent = response && response.data;
            return asset;
        });
    }
    return Promise.resolve(asset);
};

module.exports = {
    serializeMuAssets,
    deserializeMuAssets
};
