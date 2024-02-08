<?php

namespace Database\Seeders;

use App\Models\Permissions\Permission;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::findOrCreate('showModel', 'user', 'Model - wyświetlanie', 'Model');
        Permission::findOrCreate('createModel', 'user', 'Model - tworzenie', 'Model');
        Permission::findOrCreate('editModel', 'user', 'Model - edycja', 'Model');
        Permission::findOrCreate('deleteModel', 'user', 'Model - usuwanie', 'Model');

        Permission::findOrCreate('createProducts', 'user', 'Produkt - tworzenie', 'Produkty');
        Permission::findOrCreate('editProducts', 'user', 'Produkt - edycja', 'Produkty');
        Permission::findOrCreate('deleteProducts', 'user', 'Produkt - usuwanie', 'Produkty');
        Permission::findOrCreate('updateProductPrice', "user", 'Produkt - edycja cen', 'Produkty');

        Permission::findOrCreate('createImages', "user", 'Zdjęcia - dodawanie', 'Zdjęcia');
        Permission::findOrCreate('editImages', "user", 'Zdjęcia - edycja', 'Zdjęcia');
        Permission::findOrCreate('deleteImages', "user", 'Zdjęcia - usuwanie', 'Zdjęcia');

        Permission::findOrCreate('showClient', 'user', 'Klient - wyświetlanie', 'Klient');
        Permission::findOrCreate('createClient', 'user', 'Klient - tworzenie', 'Klient');
        Permission::findOrCreate('editClient', 'user', 'Klient - edycja', 'Klient');
        Permission::findOrCreate('deleteClient', 'user', 'Klient - usuwanie', 'Klient');

        Permission::findOrCreate('showRole', "user", 'Role - wyświetlanie', 'Admin');
        Permission::findOrCreate('createRole', "user", 'Role - tworzenie', 'Admin');
        Permission::findOrCreate('editRole', "user", 'Role - edycja', 'Admin');
        Permission::findOrCreate('deleteRole', "user", 'Role - usuwanie', 'Admin');

        Permission::findOrCreate('createUser', "user", 'Użytkownik - tworzenie', 'Admin');
        Permission::findOrCreate('editUser', "user", 'Użytkownik - edycja', 'Admin');
        Permission::findOrCreate('canImpersonate', "user", 'Może się wcielać w innych użytkowników', 'Admin');
        Permission::findOrCreate('canBeImpersonate', "user", 'Można się wcielić w tego użytkownika', 'Admin');


        Permission::findOrCreate('showSetting', "user", 'Ustawienia - wyświetlanie', 'Admin');
        Permission::findOrCreate('editSetting', "user", 'Ustawienia - edycja', 'Admin');

        Permission::findOrCreate('showDictionary', "user", 'Słowniki - wyświetlanie', 'Admin');
        Permission::findOrCreate('editDictionary', "user", 'Słowniki - edycja', 'Admin');


        // create roles and assign created permissions

        // this can be done as separate statements
        $admin = Role::findOrCreate('Administrator', 'user');
        Role::findOrCreate('Użytkownik', 'user');
        Role::findOrCreate('Handlowiec', 'user');
        Role::findOrCreate('Magazyn', 'user');
        Role::findOrCreate('Logistyk', 'user');

//        $role = Role::create(['guard_name' => 'admin', 'name' => 'logistyk']);
//        $role->givePermissionTo('edit articles');

        // or may be done by chaining
//        $role = Role::create(['name' => 'moderator'])
//            ->givePermissionTo(['publish articles', 'unpublish articles']);
//
//        $role = Role::create(['name' => 'super-admin']);
//        $role->givePermissionTo(Permission::all());

        $admin->syncPermissions(Permission::all());
        $user = User::find(1);
        $user->assignRole("Administrator");
    }
}
