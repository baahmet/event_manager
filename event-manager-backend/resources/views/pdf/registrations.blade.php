<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des inscrits</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
<h2>Liste des inscrits pour l'événement {{ $event->title }}</h2>
<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Nom</th>
        <th>Email</th>
        <th>Date d'inscription</th>
    </tr>
    </thead>
    <tbody>
    @foreach($registrations as $index => $registration)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $registration->user->name }}</td>
            <td>{{ $registration->user->email }}</td>
            <td>{{ $registration->created_at->format('d/m/Y H:i') }}</td> <!-- Correction ici -->
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
