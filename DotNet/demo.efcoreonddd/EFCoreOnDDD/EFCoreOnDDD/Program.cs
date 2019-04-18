using EFCoreOnDDD.Entities;
using System;
using System.Linq;

namespace EFCoreOnDDD
{
    class Program
    {
        static void Main(string[] args)
        {
            var ctx = new BookDbContext();
            var isCreated = ctx.Database.EnsureCreated();

            var books = ctx.Set<BookEntity>().ToList();

            Console.ReadKey();
        }
    }
}
