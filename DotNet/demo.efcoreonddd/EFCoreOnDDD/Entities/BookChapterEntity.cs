using System;
using System.Collections.Generic;
using System.Text;

namespace EFCoreOnDDD.Entities
{
    class BookChapterEntity
    {
        public BookChapterEntity(string title, int index)
        {
            Title = title;
            Index = index;
        }

        public string Title { get; }

        public int Index { get; }
    }

}
