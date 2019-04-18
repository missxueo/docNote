using System;
using System.Collections.Generic;
using System.Text;

namespace EFCoreOnDDD.Entities
{
    class BookCatalogEntity
    {
        public BookCatalogEntity(string name)
        {
            Name = name;
        }
        public string Name { get; }
        public string Description { get; private set; }

        public void Mark(string desc)
        {
            Description = desc;
        }
    }
}
