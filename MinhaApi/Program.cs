using MinhaApi.Repositories;
using MinhaApi.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();

builder.Services.AddScoped<
    IProdutoRepository,
    ProdutoRepository>();

builder.Services.AddScoped<
    IProdutoService,
    ProdutoService>();

builder.Services.AddScoped<
    IClienteService,
    ClienteService>();

builder.Services.AddScoped<
    IClienteRepository,
    ClienteRepository>();

builder.Services.AddScoped<
    IVendaRepository,
    VendaRepository>();
    
builder.Services.AddScoped<
    IVendaService,
    VendaService>();

builder.Services.AddScoped<
    IFornecedorService,
    FornecedorService>();

builder.Services.AddScoped<
    IFornecedorRepository,
    FornecedorRepository>();

builder.Services.AddScoped<
    IDepartamentoService,
    DepartamentoService>();

builder.Services.AddScoped<
    IDepartamentoRepository,
    DepartamentoRepository>();

builder.Services.AddScoped<
    IDashboardRepository,
    DashboardRepository>();
    
builder.Services.AddScoped<
    IDashboardService,
    DashboardService>();

// Adicionar junto com os outros services:
builder.Services.AddScoped<IFotoService, FotoService>(); // ✨


// NÃO é necessário UseStaticFiles()!
// As imagens chegam ao frontend via JSON (base64),
// não como arquivos servidos pela URL.    

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var jwtKey = builder.Configuration["Jwt:Key"]!;

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(opt => {
    opt.TokenValidationParameters = new TokenValidationParameters {
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(jwtKey)),
      ValidateIssuer   = true,
      ValidIssuer      = builder.Configuration["Jwt:Issuer"],
      ValidateAudience = true,
      ValidAudience    = builder.Configuration["Jwt:Audience"],
      ValidateLifetime = true
    };
  });

    builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
    builder.Services.AddScoped<IAuthService, AuthService>();

  var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

app.UseCors("Frontend");   // 1º CORS
app.UseAuthentication();   // 2º quem é você?
app.UseAuthorization();    // 3º você pode entrar?
app.MapControllers();


app.Run();


