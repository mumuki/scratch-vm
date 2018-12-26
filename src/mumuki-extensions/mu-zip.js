/**
 * Provides an interface for simulating a zip without actually
 * generating one to avoid overhead
*/

const buildMuZip = function(assets) {

    let assetsFiles = {};
    assets.forEach( asset => (assetsFiles[asset.fileName] = asset.fileContent) );

    const buildFile = function(file) {
        return {
            file: file,
            async: function() {
                return Promise.resolve(this.toUint8Array(this.file));
            },
            toUint8Array: function (asset) {
                asset = asset.data || asset;
                return new Uint8Array(asset)
            }
        };
    };

    let muZip = {
        assetsFiles: assetsFiles,
        file: function(assetId) {
            return buildFile(muZip.assetsFiles[assetId]);
        }
    };

    return muZip;
};

module.exports = {
    buildMuZip
};
