export interface NetworkNode {
    id: string;
    label: string;
    type: 'actor' | 'party' | 'organization' | 'position';
    group?: string;
    subtitle?: string;
    x?: number;
    y?: number;
    radius?: number;
    color?: string;
    pulse?: boolean;
}

export interface NetworkEdge {
    source: string;
    target: string;
    label?: string;
    type: 'patronase' | 'afiliasi' | 'rekomendasi' | 'alumni' | 'jabatan';
    strength?: number;
}

export interface NetworkData {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

export const gmniNetworkData: NetworkData = {
    nodes: [
        // Central actors
        { id: 'pacul', label: 'Bambang Pacul', type: 'actor', subtitle: 'Ketua PA GMNI\nWakil Ketua MPR RI', group: 'PDIP', pulse: true },
        { id: 'heri', label: 'Heri Londo', type: 'actor', subtitle: 'Sekretaris PA GMNI\nWk. Ketua DPRD', group: 'Gerindra' },
        { id: 'zulkifli', label: 'Zulkifli Gayo', type: 'actor', subtitle: 'Ketua TPPD Jateng\nTriple Affiliation', group: 'Non-Partai' },
        { id: 'lutfi', label: 'Ahmad Lutfi', type: 'actor', subtitle: 'Gubernur Jateng\nKetua PMII', group: 'Gerindra' },
        { id: 'sumanto', label: 'Sumanto', type: 'actor', subtitle: 'Ketua DPRD Jateng', group: 'PDIP' },
        { id: 'saleh', label: 'Moh. Saleh', type: 'actor', subtitle: 'Ketua KOSGORO 1957\nJateng', group: 'Golkar' },
        { id: 'sarif', label: 'Sarif Abdillah', type: 'actor', subtitle: 'Pengurus PC PMII\nJateng', group: 'PKB' },
        { id: 'taj', label: 'Taj Yasin', type: 'actor', subtitle: 'Pesantren/NU', group: 'PPP' },
        { id: 'setya', label: 'Setya Arinugroho', type: 'actor', subtitle: 'PKS Cadre', group: 'PKS' },

        // Organizations
        { id: 'gmni', label: 'PA GMNI', type: 'organization', subtitle: 'Jawa Tengah', color: '#e63946' },
        { id: 'pmii', label: 'PMII', type: 'organization', subtitle: 'NU/Islam', color: '#2a9d8f' },
        { id: 'hmi', label: 'HMI', type: 'organization', subtitle: 'Islam Modernis', color: '#e9c46a' },
        { id: 'kammi', label: 'KAMMI', type: 'organization', subtitle: 'Islam Aktivis', color: '#f4a261' },
        { id: 'kosgoro', label: 'KOSGORO 1957', type: 'organization', subtitle: 'Korporatis', color: '#e6b422' },

        // Parties
        { id: 'pdip', label: 'PDIP', type: 'party', color: '#dc2626' },
        { id: 'gerindra', label: 'Gerindra', type: 'party', color: '#7c3aed' },
        { id: 'golkar', label: 'Golkar', type: 'party', color: '#eab308' },
        { id: 'pkb', label: 'PKB', type: 'party', color: '#16a34a' },
        { id: 'ppp', label: 'PPP', type: 'party', color: '#0ea5e9' },
        { id: 'pks', label: 'PKS', type: 'party', color: '#f97316' },

        // Position
        { id: 'tppd', label: 'TPPD', type: 'position', subtitle: 'Tim Percepatan\nPembangunan Daerah', color: '#c4a35a' },
    ],

    edges: [
        // GMNI Patronage Chain
        { source: 'pacul', target: 'gmni', label: 'Ketua', type: 'jabatan', strength: 3 },
        { source: 'heri', target: 'gmni', label: 'Sekretaris', type: 'jabatan', strength: 3 },
        { source: 'zulkifli', target: 'gmni', label: 'Alumni', type: 'alumni', strength: 2 },
        { source: 'pacul', target: 'heri', label: 'Patronase', type: 'patronase', strength: 3 },
        { source: 'heri', target: 'zulkifli', label: 'Rekomendasi', type: 'rekomendasi', strength: 3 },

        // Party affiliations
        { source: 'pacul', target: 'pdip', type: 'afiliasi', strength: 2 },
        { source: 'sumanto', target: 'pdip', type: 'afiliasi', strength: 2 },
        { source: 'heri', target: 'gerindra', type: 'afiliasi', strength: 2 },
        { source: 'lutfi', target: 'gerindra', type: 'afiliasi', strength: 2 },
        { source: 'saleh', target: 'golkar', type: 'afiliasi', strength: 2 },
        { source: 'sarif', target: 'pkb', type: 'afiliasi', strength: 2 },
        { source: 'taj', target: 'ppp', type: 'afiliasi', strength: 2 },
        { source: 'setya', target: 'pks', type: 'afiliasi', strength: 2 },

        // Triple affiliation of Zulkifli
        { source: 'zulkifli', target: 'hmi', label: 'Aktif', type: 'afiliasi', strength: 2 },
        { source: 'zulkifli', target: 'kammi', label: 'Aktif', type: 'afiliasi', strength: 2 },

        // Organization affiliations
        { source: 'lutfi', target: 'pmii', label: 'Ketua', type: 'jabatan', strength: 2 },
        { source: 'sarif', target: 'pmii', label: 'Pengurus', type: 'jabatan', strength: 2 },
        { source: 'saleh', target: 'kosgoro', label: 'Ketua', type: 'jabatan', strength: 2 },

        // TPPD position
        { source: 'zulkifli', target: 'tppd', label: 'Ketua', type: 'jabatan', strength: 3 },

        // Cross-ideological bridge
        { source: 'pacul', target: 'pdip', label: 'Ketua DPD', type: 'jabatan', strength: 2 },

        // Unissula connection
        { source: 'zulkifli', target: 'saleh', label: 'Alumni Unissula', type: 'alumni', strength: 1 },
    ],
};
