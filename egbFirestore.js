const { initializeApp } = require('firebase/app');
const { getFirestore, getDocs, collection, addDoc, doc, setDoc, getDoc } = require('firebase/firestore');
const { firebaseConfig } = require('./config.json');

/**
 * Basically JSON but with Google's databases!
 */
class egbFirestore {
	constructor() {
		initializeApp(firebaseConfig);
		this.firestore = getFirestore();
		return this;
	}
	async getDocuments(collectionName) {
		const snapshot = await getDocs(collection(this.firestore, collectionName));
		const obj = {};
		snapshot.forEach((document) => {
			obj[document.id] = { ...document.data(), document_id: document.id };
		});
		return obj;
	}
	async addDocument(collectionName, data) {
		await addDoc(collection(this.firestore, collectionName), data);
	}
	async setDocumentData(collectionName, documentName, data) {
		await setDoc(doc(this.firestore, collectionName, documentName), data);
	}
	async getDocument(collectionName, documentName) {
		const docSnap = await getDoc(doc(this.firestore, collectionName, documentName));
		if (!docSnap.exists()) throw new Error('document does not exist!');
		return docSnap.data();
	}
	applyTemplate(data, template) {
		if (data == null) data = {};
		for (const property in template) {
			if (!data[property]) {
				data[property] = template[property];
			}
		}
		return data;
	}
}
module.exports = egbFirestore;