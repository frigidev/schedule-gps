# schedule-gps
 Mobile Ionic app with Angular and SQLite using Ionic Storage.

 MVC is a design pattern that helps to divide/modularize the software development, in the Model that represents data/business rules, the View that represents the interface that the user interacts with, and the Controller that is used to create the logic of the application/software with the model's data. Applications in Angular are developed using a variant of this concept implicitly.

 Ionic allows to develop hibrid applications, that runs in Desktop, Web and Mobile. But he is mainly used for mobile apps, combined with Angular (it is possible to use with React or Vue aswell).

 The precedence of databases was defined in a fallback of SQLite -> IndexedDB -> Localstorage with Ionic Storage. The first one 
 available in the device, in the fallback order, is used.

 # app content
 The app is basically an schedule that the user can register contacts, with their names, phone numbers and email, in the tabs 1 and 2, and the 3rd tab is a page that shows the user current coordinates (latitude and longitude, accessing his native GPS of device), and can follow his position in a Google Map, marking his current position.

 # technologies used
 Angular and Ionic to make the hibrid app, Capacitor to access native functionalities of device (GPS specifically), SQLite with Ionic Storage, several Ionic Components to build the view, Google Map (necessary to generate an API Token to use the map), ReactiveForms, some simple custom Regex for validations patterns and Virtual Scroll to make an optimized scroll bar in a big list.

 To add android and ios with Capacitor to the app it is necessary to use the following scripts:
 `ionic cap add android` and `ionic cap add ios`, and then run into a device or a virtual device.

 # Português
 # schedule-gps
 Aplicativo mobile Ionic/Angular e SQLite usando Ionic Storage.

 MVC é um padrão de design de software que ajuda a dividir/modularizar o desenvolvimento do software, no Model são representados os dados/regras de negócio, na View é representada a interface que o usuário interage com, e na Controller se cria a lógica da aplicação/software com os dados da Model. Aplicações em Angular são desenvolvidas utilizando uma variante desse conceito implicitamente.

 Ionic permite o desenvolvimento de aplicações híbridas, que podem rodar em Desktop, Web e Mobile. Porém ele é utilizado principalmente para apps mobile, combinado com Angular (também é possível utilizar o Ionic com o React ou Vue).

 A precedência dos databases foi definida em um fallback de SQLite -> IndexedDB -> Localstorage com Ionic Storage. O primeiro disponível no dispositivo/plataforma, na ordem de precedência do fallback, é utilizado.

 # conteúdo do app
 O app é basicamente uma agenda em que o usuário pode registrar contatos, com seus nomes, números de telefone e email, nas tabs 1 e 2, e a tab 3 basicamente é uma página que mostra as coordenadas atuais (latitude e longitude, acessando o GPS nativo do dispositivo), e pode acompanhar a posição no Google Map utilizado, marcando a sua posição atual.

# tecnologias utilizadas
 Angular e Ionic para criar o app híbrido, Capacitor para acessar funcionalidades nativas do dispositivo (GPS especificamente), SQLite com Ionic Storage, vários Ionic Components para construir a view, Google Map (necessário gerar um API Token para usar o mapa), ReactiveForms, alguns simples Regex para padrões de validações nos campos do formulário reativo e Virtual Scroll para fazer uma barra de rolagem otimizada em uma lista grande.

 Para adicionar android e ios com o Capacitor na aplicação é necessário utilizar os seguintes scripts:
 `ionic cap add android` e `ionic cap add ios`, e então rodar em um dispositivo ou dispositivo virtual.
