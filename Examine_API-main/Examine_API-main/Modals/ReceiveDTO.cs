using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TodoApi2
{
    public class ReceiveDTO<T>
    {
        public string Action { set; get; }
        public T parameter { set; get; }
    }
}