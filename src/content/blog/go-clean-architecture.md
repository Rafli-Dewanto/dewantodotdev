---
title: Go Clean Architecture
excerpt: Di bidang software engineering, arsitektur aplikasi memainkan peran penting dalam mendefinisikan struktur aplikasi yang scalable.
publishDate: 'Sep 10 2024'
tags:
  - Go
  - Clean Architecture
seo:
  image:
    src: '/image/clean-arch.png'
    alt: 'clean architecture'
isFeatured: true
---

Di bidang software engineering, arsitektur aplikasi memainkan peran penting dalam mendefinisikan struktur aplikasi yang scalable. Salah satu arsitektur yang cukup banyak digunakan adalah Clean Architecture, yang bertujuan untuk membuat sistem yang mudah dimaintenance, test, dan dipahami oleh banyak orang.

![Clean Architecture](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/btcziclitkflbypb6zuv.png)

Blog ini akan membahas Clean Architecture di bahasa pemrograman Go walaupun dari designnya sendiri bisa kalian implementasikan ke bahasa / framework manapun. Saya akan membahas Clean Architecture versi saya yang diambil dari beberapa sumber, karena implementasi dari arsitektur ini bisa berbeda-beda dari setiap tim atau software engineer.

## Why Clean Architecture?

Clean Architecture adalah filosofi desain yang diperkenalkan oleh Robert C. Martin (uncle Bob) yang menekankan pada separation of concerns (soc) dan pemisahan business logic dari bagian eksternal seperti database dan UI. Dengan mengadopsi Clean Architecture di Go, developer dapat membuat aplikasi modular dan terukur yang lebih mudah dipelihara dan beradaptasi dengan kebutuhan yang berubah.

### Benefits of Clean Architecture

1. **Separation of Concerns**: Lapisan yang berbeda menangani tugas yang spesifik, sehingga mengurangi dependency.
2. **Testability**: Business logic bisa ditest tanpa bergantung pada bagian eksternal
3. **Flexibility**: Komponen dapat diganti atau di-”upgrade”
4. **Maintainability**: Struktur yang jelas memungkinkan developer untuk memahami dan memodifikasi codebase dengan mudah.

Di sini saya menggunakan beberapa komponen / layer, diantaranya:

- **Repository Layer**: operasi database
- **Usecase Layer**: business logic dari aplikasi
- **Handler/Controller Layer**: handle HTTP request / response (bagian ini bisa berubah tergantung gateway yang kalian gunakan, e.g., HTTP, gRPC, messaging etc)
- **Model Layer**: struktur request payload (DTO).
- **Converter/Mapper Layer**: menjaga konsistensi dan struktur response dari aplikasi
- **Entity Layer**: representasi entity database

Pemisahan layer ini memudahkan untuk memperbarui atau mengubah bagian mana pun dari aplikasi tanpa memengaruhi layer lainnya.

### Flow

Untuk memudahkan, kita akan membuat aplikasi todo dengan implementasi clean architecture.

### 1. Entity (Database Entity)

Entity merepresentasikan objek Todo di dalam database. Kita mendefinisikan sebuah struktur yang menggambarkan bagaimana data disimpan di dalam database.

```go
package entity

import "gorm.io/gorm"

type Todo struct {
    gorm.Model
    Title       string `json:"title"`
    Description string `json:"description"`
    Completed   bool   `json:"completed"`
}

```

### 2. Model (DTO - Data Transfer Object)

Selanjutnya kita membuat model / DTO untuk menstruktur body payload ketika user membuat todo, sehingga client dapat mengirim payload yang konsisten pada setiap request.

```go
package model

type AddTodoPayload struct {
    Title       string `json:"title" validate:"required"`
    Description string `json:"description"`
}

type UpdateTodoPayload struct {
    Title       string `json:"title"`
    Description string `json:"description"`
    Completed   bool   `json:"completed"`
}

```

### 3. Repository

Repository ini merupakan layer di mana kita akan berinteraksi dengan database, di sini saya menggunakan interface untuk mendefinisikan semua method yang harus dimiliki oleh repository walaupun Go sendiri tidak secara strict membuat semua method tersebut harus diimplementasi karena Go bukan bahasa OOP seperti java yang mana semua method pada interface harus diimplementasi.

```go
package repository

import "github.com/Rafli-Dewanto/todo/entity"

type TodoRepository interface {
    Add(todo *entity.Todo) error
    Update(todo *entity.Todo) error
    FindAll() ([]*entity.Todo, error)
    Delete(id uint) error
}

type todoRepository struct {
    db *gorm.DB
}

func NewTodoRepository(db *gorm.DB) TodoRepository {
    return &todoRepository{db: db}
}

func (r *todoRepository) Add(todo *entity.Todo) error {
    return r.db.Create(todo).Error
}

func (r *todoRepository) Update(todo *entity.Todo) error {
    return r.db.Save(todo).Error
}

func (r *todoRepository) FindAll() ([]*entity.Todo, error) {
    var todos []*entity.Todo
    if err := r.db.Find(&todos).Error; err != nil {
        return nil, err
    }
    return todos, nil
}

func (r *todoRepository) Delete(id uint) error {
    return r.db.Delete(&entity.Todo{}, id).Error
}

```

Di sini kita menggunakan teknik dependency injection untuk passing sebuah “dependency” atau utilitas yang dibutuhkan sebuah layer, untuk contoh ini, repository membutuhkan gorm sebagai ORM untuk interaksi dengan database. Apa itu dependency injection? Simplest way i can describe it adalah di mana kita passing sebuah object ke layer lain supaya kita tidak perlu menginisiasi object tersebut secara terus menerus. Di Clean Architecture, dependency injection sangat penting karena memastikan bahwa setiap layer tidak bergantung pada layer di bawahnya.

> Maksudnya apa?

### Dependency Injection dan Dependency Inversion Principle (DIP):
- Dependency Injection (DI): Adalah teknik di mana objek atau layanan yang dibutuhkan oleh suatu layer diberikan (injected) kepada layer tersebut, daripada layer tersebut membuat sendiri atau secara langsung bergantung pada implementasi konkret.

- Dependency Inversion Principle (DIP): Prinsip ini menyatakan bahwa modul tingkat tinggi tidak boleh bergantung pada modul tingkat rendah, keduanya harus bergantung pada abstraksi (antarmuka). Dengan kata lain, lapisan bisnis (use case) tidak langsung bergantung pada lapisan infrastruktur (database, web framework, dsb.), tetapi hanya pada abstraksi (interface) yang didefinisikan.

Jadi, di Clean Architecture:

Lapisan Use Case memang membutuhkan Repository untuk menyimpan dan mengambil data, tetapi ia tidak bergantung pada implementasi konkret dari repository tersebut. Sebaliknya, ia bergantung pada interface yang menggambarkan perilaku yang diharapkan dari repository. Implementasi nyata dari repository tersebut akan "di-inject" saat runtime.

Dengan DI, ketergantungan dikelola di level yang lebih tinggi (misalnya saat aplikasi di-bootstrap atau inisialisasi), dan setiap layer hanya mengetahui abstraksi, bukan implementasi konkret.

### 4. Usecase

Use case layer merupakan business logic dari aplikasi kita yang berinteraksi dengan repository yang sudah kita definisikan sebelumnya.

```go
package usecase

import (
    "github.com/Rafli-Dewanto/todo/entity"
    "github.com/Rafli-Dewanto/todo/model"
    "github.com/Rafli-Dewanto/todo/repository"
)

type TodoUsecase interface {
    AddTodo(payload *model.AddTodoPayload) error
    UpdateTodo(id uint, payload *model.UpdateTodoPayload) error
    GetTodos() ([]*entity.Todo, error)
    DeleteTodo(id uint) error
}

type todoUsecase struct {
    todoRepo repository.TodoRepository
}

func NewTodoUsecase(todoRepo repository.TodoRepository) TodoUsecase {
    return &todoUsecase{todoRepo: todoRepo}
}

func (uc *todoUsecase) AddTodo(payload *model.AddTodoPayload) error {
    todo := &entity.Todo{
        Title:       payload.Title,
        Description: payload.Description,
        Completed:   false,
    }
    return uc.todoRepo.Add(todo)
}

func (uc *todoUsecase) UpdateTodo(id uint, payload *model.UpdateTodoPayload) error {
    todo, err := uc.todoRepo.FindByID(id)
    if err != nil {
        return err
    }

    todo.Title = payload.Title
    todo.Description = payload.Description
    todo.Completed = payload.Completed
    return uc.todoRepo.Update(todo)
}

func (uc *todoUsecase) GetTodos() ([]*entity.Todo, error) {
    return uc.todoRepo.FindAll()
}

func (uc *todoUsecase) DeleteTodo(id uint) error {
    return uc.todoRepo.Delete(id)
}

```

### 5. Handler/Controller

Handler mengelola request dan response HTTP. Layer ini berinteraksi dengan use case untuk melakukan action seperti membuat todo, layer ini berfokus dengan hal-hal yang berhubungan dengan HTTP seperti status code, HTTP headers, parsing body payload dan lain-lain.

```go
package handler

import (
    "github.com/gofiber/fiber/v2"
    "github.com/Rafli-Dewanto/todo/model"
    "github.com/Rafli-Dewanto/todo/usecase"
)

type TodoHandler struct {
    todoUC usecase.TodoUsecase
}

func NewTodoHandler(todoUC usecase.TodoUsecase) *TodoHandler {
    return &TodoHandler{todoUC: todoUC}
}

func (h *TodoHandler) CreateTodo(c *fiber.Ctx) error {
    var payload model.AddTodoPayload
    if err := c.BodyParser(&payload); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
    }

    if err := h.todoUC.AddTodo(&payload); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Todo created"})
}

func (h *TodoHandler) GetTodos(c *fiber.Ctx) error {
    todos, err := h.todoUC.GetTodos()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(todos)
}

```

### 6. Converter/Mapper (Optional)

Jika kalian menginginkan konsistensi dari sebuah response, alangkah baiknya jika kita membuat mapper atau converter yang bertugas memberikan struktur yang konsisten untuk setiap response sehingga jika ada perubahan pada entity tidak akan terjadi unexpected behaviour.

```go
package converter

import "github.com/Rafli-Dewanto/todo/model"

func TodoToResponse(todo *entity.Todo) map[string]interface{} {
    return map[string]interface{}{
        "id":          todo.ID,
        "title":       todo.Title,
        "description": todo.Description,
        "completed":   todo.Completed,
    }
}

```

### Conclusion

Nah tadi itu merupakan implementasi sederhana dari **Clean Architecture** pada bahasa Go. Clean Architecture sendiri memberikan framework yang rapi untuk memisahkan business logic, UI, dan infrastrukturnya, sehingga membuat aplikasi lebih mudah untuk dipelihara, diuji, dan diperluas. Ini adalah pendekatan dasar, dan kalian bisa memperluas arsitektur ini untuk aplikasi yang lebih kompleks dengan menambahkan komponen seperti middleware, caching, dan lain-lain sesuai kebutuhan aplikasi.

Sources:

- [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [https://github.com/khannedy/golang-clean-architecture](https://github.com/khannedy/golang-clean-architecture)
