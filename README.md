# Open Api
 The OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs. Nest provides a dedicated module which allows generating such a specification by leveraging decorators.


# Getting started
`npm install --save @nestjs/swagger`

 initialize swagger using the swaggerModule class

`async function bootstrap() {`
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
    
    const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };

  const document = SwaggerModule.createDocument(app, config,options);
  SwaggerModule.setup('api', app, document);

  `await app.listen(3000);`
`}`

wuth this config the SwaggerModule automatically reflects all of your endpoints.

The SwaggerModule searches for all @Body(), @Query(), and @Param() decorators in route handlers to generate the API document. It also creates corresponding model definitions by taking advantage of reflection. 

# Defining ApiProperty
Swagger doesn't automaticallically pick up class property  in class dto so we need to specify api property using the 
@ApiProperty decorator .

`@ApiProperty()`
`@ApiProperty({`
  description: 'The age of a cat',
  minimum: 1,
  default: 1,
`})`

`@ApiPropertyOptional()` for optional props


Name controller in swagger
`@ApiTags('cats')`


`@ApiHeader({`
  name: 'X-MyHeader',
  description: 'Custom header',
`})`

# Security

You need to addSecurity to DocumentBuilder before @ApiSecurity works
`@ApiSecurity('basic')`
basic or bearer

`const options = new DocumentBuilder().`addSecurity('basic', {
  type: 'http',
  scheme: 'basic',
});


both can be used instead of addSecurity 
`.addBasicAuth()`
`.addBearerAuth()`

the values of the auth would be passed as headers


# CLI Plugin
TypeScript's metadata reflection system has several limitations which make it impossible to, for instance, determine what properties a class consists of or recognize whether a given property is optional or required. However, some of these constraints can be addressed at compilation time. Nest provides a plugin that enhances the TypeScript compilation process to reduce the amount of boilerplate code required.

HINT
This plugin is opt-in. If you prefer, you can declare all decorators manually, or only specific decorators where you need them.
Overview#
The Swagger plugin will automatically:

annotate all DTO properties with @ApiProperty unless @ApiHideProperty is used
set the required property depending on the question mark (e.g. name?: string will set required: false)
set the type or enum property depending on the type (supports arrays as well)
set the default property based on the assigned default value
set several validation rules based on class-validator decorators (if classValidatorShim set to true)
add a response decorator to every endpoint with a proper status and type (response model)
generate descriptions for properties and endpoints based on comments (if introspectComments set to true)
generate example values for properties based on comments (if introspectComments set to true)
Please, note that your filenames must have one of the following suffixes: ['.dto.ts', '.entity.ts'] (e.g., create-user.dto.ts) in order to be analysed by the plugin.

If you are using a different suffix, you can adjust the plugin's behavior by specifying the dtoFileNameSuffix option (see below).

Previously, if you wanted to provide an interactive experience with the Swagger UI, you had to duplicate a lot of code to let the package know how your models/components should be declared in the specification. For example, you could define a simple CreateUserDto class as follows:


export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: RoleEnum, default: [], isArray: true })
  roles: RoleEnum[] = [];

  @ApiProperty({ required: false, default: true })
  isEnabled?: boolean = true;
}
While not a significant issue with medium-sized projects, it becomes verbose & hard to maintain once you have a large set of classes.

By enabling the Swagger plugin, the above class definition can be declared simply:


export class CreateUserDto {
  email: string;
  password: string;
  roles: RoleEnum[] = [];
  isEnabled?: boolean = true;
}
The plugin adds appropriate decorators on the fly based on the Abstract Syntax Tree. Thus you won't have to struggle with @ApiProperty decorators scattered throughout the code.

HINT
The plugin will automatically generate any missing swagger properties, but if you need to override them, you simply set them explicitly via @ApiProperty().
Comments introspection#
With the comments introspection feature enabled, CLI plugin will generate descriptions and example values for properties based on comments.

For example, given an example roles property:


/**
 * A list of user's roles
 * @example ['admin']
 */
@ApiProperty({
  description: `A list of user's roles`,
  example: ['admin'],
})
roles: RoleEnum[] = [];
You must duplicate both description and example values. With introspectComments enabled, the CLI plugin can extract these comments and automatically provide descriptions (and examples, if defined) for properties. Now, the above property can be declared simply as follows:


/**
 * A list of user's roles
 * @example ['admin']
 */
roles: RoleEnum[] = [];
There are dtoKeyOfComment and controllerKeyOfComment plugin options that you can use to customize how the plugin will set the value for ApiProperty and ApiOperation decorators respectively. Take a look at the following example:


export class SomeController {
  /**
   * Create some resource
   */
  @Post()
  create() {}
}
By default, these options are set to "description". This means the plugin will assign "Create some resource" to description key on the ApiOperation operator. Like so:


@ApiOperation({ description: "Create some resource" })
HINT
For models, the same logic applies but to ApiProperty decorator instead.
Using the CLI plugin#
To enable the plugin, open nest-cli.json (if you use Nest CLI) and add the following plugins configuration:


{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
You can use the options property to customize the behavior of the plugin.


"plugins": [
  {
    "name": "@nestjs/swagger",
    "options": {
      "classValidatorShim": false,
      "introspectComments": true
    }
  }
]
The options property has to fulfill the following interface:


export interface PluginOptions {
  dtoFileNameSuffix?: string[];
  controllerFileNameSuffix?: string[];
  classValidatorShim?: boolean;
  dtoKeyOfComment?: string;
  controllerKeyOfComment?: string;
  introspectComments?: boolean;
}
