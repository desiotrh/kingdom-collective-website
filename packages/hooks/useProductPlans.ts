import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
// Firestore imports
import { db, auth } from '../../apps/kingdom-launchpad/app/firebaseConfig';
import { collection, doc, setDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

export interface ProductPlan {
    id: string;
    name: string;
    type: string;
    audience: string;
    problem: string;
    features: string[];
    price: number;
    platforms: string[];
    goalDate: string;
    faithMode: boolean;
    dateCreated: string;
    description?: string;
}

const STORAGE_KEY = 'kingdom_launchpad_product_plans';

export function useProductPlans() {
    const [plans, setPlans] = useState<ProductPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [privacyLabel, setPrivacyLabel] = useState('Your plans are secure. What God starts, He finishes.');

    // Firestore sync on login
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Sync local to Firestore
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                const localPlans: ProductPlan[] = raw ? JSON.parse(raw) : [];
                const userRef = collection(db, 'users', user.uid, 'productPlans');
                for (const plan of localPlans) {
                    await setDoc(doc(userRef, plan.id), plan, { merge: true });
                }
                // Listen for remote changes
                onSnapshot(userRef, (snapshot) => {
                    const remotePlans: ProductPlan[] = [];
                    snapshot.forEach(doc => remotePlans.push(doc.data() as ProductPlan));
                    setPlans(remotePlans);
                    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remotePlans));
                });
            } else {
                loadPlans();
            }
        });
        return () => unsubscribe();
    }, []);

    const loadPlans = useCallback(async () => {
        setLoading(true);
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                setPlans(JSON.parse(raw));
            } else {
                setPlans([]);
            }
        } catch {
            setPlans([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const savePlan = useCallback(async (plan: Omit<ProductPlan, 'id' | 'dateCreated'>) => {
        const newPlan: ProductPlan = {
            ...plan,
            id: uuidv4(),
            dateCreated: new Date().toISOString(),
        };
        const updated = [newPlan, ...plans];
        setPlans(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // Firestore sync if logged in
        const user = auth.currentUser;
        if (user) {
            const userRef = collection(db, 'users', user.uid, 'productPlans');
            await setDoc(doc(userRef, newPlan.id), newPlan, { merge: true });
        }
        return newPlan;
    }, [plans]);

    const deletePlan = useCallback(async (id: string) => {
        const updated = plans.filter(i => i.id !== id);
        setPlans(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // Firestore sync if logged in
        const user = auth.currentUser;
        if (user) {
            const userRef = collection(db, 'users', user.uid, 'productPlans');
            await setDoc(doc(userRef, id), {}, { merge: false }); // Remove doc
        }
    }, [plans]);

    return {
        plans,
        loading,
        savePlan,
        deletePlan,
        reload: loadPlans,
        privacyLabel,
    };
} 