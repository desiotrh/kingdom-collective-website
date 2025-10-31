import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(
  process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 
  'hex'
);
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Encrypt sensitive database fields with AES-256-GCM
 * Proverbs 27:12 - Security is stewardship
 * 
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted text with IV and auth tag
 */
export function encrypt(text) {
    if (!text) return text;
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.pbkdf2Sync(KEY, salt, 100000, 32, 'sha512');
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(String(text), 'utf8'),
        cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
}

/**
 * Decrypt sensitive database fields
 * 
 * @param {string} encryptedText - Encrypted text with IV and auth tag
 * @returns {string} Decrypted plain text
 */
export function decrypt(encryptedText) {
    if (!encryptedText) return encryptedText;
    
    try {
        const stringValue = Buffer.from(String(encryptedText), 'hex');
        
        const salt = stringValue.slice(0, SALT_LENGTH);
        const iv = stringValue.slice(SALT_LENGTH, TAG_POSITION);
        const tag = stringValue.slice(TAG_POSITION, ENCRYPTED_POSITION);
        const encrypted = stringValue.slice(ENCRYPTED_POSITION);
        
        const key = crypto.pbkdf2Sync(KEY, salt, 100000, 32, 'sha512');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        
        return decipher.update(encrypted) + decipher.final('utf8');
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

/**
 * Middleware to encrypt/decrypt model fields automatically
 * 
 * @param {Array<string>} fieldsToEncrypt - Array of field names to encrypt
 * @returns {Object} Middleware with pre and post hooks
 */
export function createEncryptionMiddleware(fieldsToEncrypt = []) {
    return {
        // Before save - encrypt fields
        pre: function(next) {
            fieldsToEncrypt.forEach(field => {
                if (this[field] && !this[field].startsWith('encrypted:')) {
                    this[field] = 'encrypted:' + encrypt(this[field]);
                }
            });
            next();
        },
        
        // After find - decrypt fields
        post: function(doc) {
            if (!doc) return;
            
            const decryptDoc = (document) => {
                fieldsToEncrypt.forEach(field => {
                    if (document[field] && document[field].startsWith('encrypted:')) {
                        document[field] = decrypt(document[field].substring(10));
                    }
                });
            };
            
            if (Array.isArray(doc)) {
                doc.forEach(decryptDoc);
            } else {
                decryptDoc(doc);
            }
        }
    };
}

/**
 * Example usage:
 * 
 * import { createEncryptionMiddleware } from '../services/encryption.js';
 * 
 * const userSchema = new mongoose.Schema({
 *     email: String,
 *     ssn: String,           // Sensitive field
 *     phoneNumber: String    // Sensitive field
 * });
 * 
 * const encryptionMiddleware = createEncryptionMiddleware(['ssn', 'phoneNumber']);
 * userSchema.pre('save', encryptionMiddleware.pre);
 * userSchema.post('find', encryptionMiddleware.post);
 * userSchema.post('findOne', encryptionMiddleware.post);
 */

