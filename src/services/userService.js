import { supabase } from '../lib/supabase';

export const userService = {
    async fetchEmpleadoByUid(userId) {
        return await supabase
            .from('empleados')
            .select('*')
            .eq('auth_uid', userId)
            .maybeSingle();
    },

    async fetchEmpleadoByEmail(email) {
        return await supabase
            .from('empleados')
            .select('*')
            .eq('email', email)
            .maybeSingle();
    },

    async fetchProfileByUid(userId) {
        return await supabase
            .from('profiles')
            .select('rol, empresa_id')
            .eq('id', userId)
            .maybeSingle();
    },

    async fetchEmpresaById(empresaId) {
        return await supabase
            .from('empresas')
            .select('razon_social, correo')
            .eq('id', empresaId)
            .maybeSingle();
    },

    async getEmpleadoData(userId, email) {
        let { data: empleado } = await this.fetchEmpleadoByUid(userId);
        if (!empleado) {
            const { data: porEmail } = await this.fetchEmpleadoByEmail(email);
            if (porEmail) empleado = porEmail;
        }
        return empleado;
    },

    async getAdminData(userId, email) {
        const { data: perfil } = await this.fetchProfileByUid(userId);
        const empresaId = perfil?.empresa_id;
        if (!empresaId) {
            return {
                tipo:     'admin',
                nombre:   email?.split('@')[0] ?? 'Admin',
                email:    email ?? '',
                rol:      'admin',
                permisos: null,
                activo:   true,
            };
        }

        const { data: empresa } = await this.fetchEmpresaById(empresaId);
        return {
            tipo:     'admin',
            nombre:   empresa?.razon_social ?? 'Administrador',
            email:    empresa?.correo ?? email,
            rol:      'admin',
            permisos: null,
            activo:   true,
        };
    },

    async createEmpresa(nit, razonSocial, domicilio, email) {
        return await supabase
            .from('empresas')
            .insert([{
                nit: nit,
                razon_social: razonSocial,
                domicilio_fiscal: domicilio,
                correo: email,
            }])
            .select()
            .single();
    },

    async updateProfileEmpresaAndRole(userId, empresaId, role) {
        return await supabase
            .from('profiles')
            .update({
                empresa_id: empresaId,
                rol: role,
            })
            .eq('id', userId);
    },

    async getEmpleados(empresaId) {
        return await supabase
            .from('empleados')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false });
    },

    async updateEmpleado(empleadoId, data) {
        return await supabase
            .from('empleados')
            .update(data)
            .eq('id', empleadoId);
    },

    async deleteEmpleado(empleadoId) {
        return await supabase
            .from('empleados')
            .delete()
            .eq('id', empleadoId);
    },

    async createEmpleado(data) {
        return await supabase
            .from('empleados')
            .insert([data]);
    },

    async updateEmpresaData(empresaId, data) {
        return await supabase
            .from('empresas')
            .update(data)
            .eq('id', empresaId);
    },

    async fetchAdminProfileAndEmpresa(userId) {
        const { data: perfil, error: perfilError } = await supabase
            .from('profiles')
            .select('empresa_id')
            .eq('id', userId)
            .single();

        if (perfilError) throw perfilError;
        if (!perfil?.empresa_id) return null;

        const { data: empresa, error: empresaError } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', perfil.empresa_id)
            .single();

        if (empresaError) throw empresaError;
        return { perfil, empresa };
    }
};
