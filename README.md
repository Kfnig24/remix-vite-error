# JobTeen Web

L'application JobTeen pour le Web

## Comment tester

Créer une instance Supabase local en lançant:
```ssh
supabase init
```
avec le CLI Supabase installé.

Créer un fichier *.env.local* à la route du dossier et donner les variables:

```ssh
<!-- Copier les valeurs donner dans le output de supabase init-->
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

<!-- Créer un compte Stripe test -->
STRIPE_SECRET_KEY=
```